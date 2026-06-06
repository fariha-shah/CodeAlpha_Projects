import { useEffect, useRef, useState, useCallback } from 'react';
import Peer from 'simple-peer';
import socket from '../api/socket';

export default function useWebRTC({ roomId, username }) {
  const [peers, setPeers] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const peersRef = useRef([]);

  const createPeer = useCallback(
    (targetId, targetUsername, stream) => {
      const peer = new Peer({ initiator: true, trickle: true, stream });

      peer.on('signal', (offer) => {
        socket.emit('offer', {
          to: targetId,
          offer,
          from: socket.id,
          username,
        });
      });

      peer.on('stream', (remoteStream) => {
        setPeers((prev) =>
          prev.map((p) =>
            p.socketId === targetId ? { ...p, stream: remoteStream } : p
          )
        );
      });

      peer.on('error', (err) => console.error('Peer error:', err));
      return peer;
    },
    [username]
  );

  const addPeer = useCallback((fromId, fromUsername, incomingOffer, stream) => {
    const peer = new Peer({ initiator: false, trickle: true, stream });

    peer.on('signal', (answer) => {
      socket.emit('answer', { to: fromId, answer, from: socket.id });
    });

    peer.on('stream', (remoteStream) => {
      setPeers((prev) =>
        prev.map((p) =>
          p.socketId === fromId ? { ...p, stream: remoteStream } : p
        )
      );
    });

    peer.on('error', (err) => console.error('Peer error:', err));
    peer.signal(incomingOffer);
    return peer;
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        // Agar already connected hai toh dobara connect mat karo
        if (socket.connected) {
          socket.disconnect();
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        setLocalStream(stream);

        socket.connect();
        socket.emit('join-room', { roomId, username });
        socket.on('room-users', (users) => {
          // Apne aap ko filter karo
          const others = users.filter((u) => u.socketId !== socket.id);
          const newPeers = others.map(({ socketId, username: uname }) => {
            const peer = createPeer(socketId, uname, stream);
            peersRef.current.push({ socketId, username: uname, peer });
            return { socketId, username: uname, peer, stream: null };
          });
          setPeers(newPeers);
        });

        socket.on('user-joined', ({ socketId, username: uname }) => {
          // Apne aap ko filter karo
          if (socketId === socket.id) return;

          setPeers((prev) => [
            ...prev,
            { socketId, username: uname, peer: null, stream: null },
          ]);
          peersRef.current.push({ socketId, username: uname, peer: null });
        });

        socket.on('offer', ({ from, offer, username: uname }) => {
          // Apne aap se offer nahi lena
          if (from === socket.id) return;

          const existing = peersRef.current.find((p) => p.socketId === from);
          if (existing?.peer && !existing.peer.destroyed) return;

          const peer = addPeer(from, uname, offer, stream);
          peersRef.current = peersRef.current.map((p) =>
            p.socketId === from ? { ...p, peer } : p
          );
          setPeers((prev) =>
            prev.map((p) => (p.socketId === from ? { ...p, peer } : p))
          );
        });

        // Receive an answer
        socket.on('answer', ({ from, answer }) => {
          const peerObj = peersRef.current.find((p) => p.socketId === from);
          if (peerObj?.peer && !peerObj.peer.destroyed) {
            try {
              peerObj.peer.signal(answer);
            } catch (err) {
              console.error('Answer signal error:', err);
            }
          }
        });

        // Receive ICE candidate
        socket.on('ice-candidate', ({ from, candidate }) => {
          const peerObj = peersRef.current.find((p) => p.socketId === from);
          if (peerObj?.peer && !peerObj.peer.destroyed) {
            try {
              peerObj.peer.signal(candidate);
            } catch (err) {
              console.error('ICE signal error:', err);
            }
          }
        });
        socket.on('user-left', ({ socketId }) => {
          const peerObj = peersRef.current.find((p) => p.socketId === socketId);
          if (peerObj?.peer) peerObj.peer.destroy();
          peersRef.current = peersRef.current.filter(
            (p) => p.socketId !== socketId
          );
          setPeers((prev) => prev.filter((p) => p.socketId !== socketId));
        });

        // Screen share started by someone else
        socket.on('screen-share-started', ({ socketId }) => {
          setPeers((prev) =>
            prev.map((p) =>
              p.socketId === socketId ? { ...p, isSharing: true } : p
            )
          );
        });

        // Screen share stopped by someone else
        socket.on('screen-share-stopped', ({ socketId }) => {
          setPeers((prev) =>
            prev.map((p) =>
              p.socketId === socketId ? { ...p, isSharing: false } : p
            )
          );
        });
      } catch (err) {
        console.error('Media error:', err);
        alert('Could not access camera/microphone. Please allow permissions.');
      }
    };

    init();

    return () => {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      peersRef.current.forEach((p) => p.peer?.destroy());
      socket.emit('leave-room', { roomId });
      socket.disconnect();
      socket.off('room-users');
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-left');
      socket.off('screen-share-started');
      socket.off('screen-share-stopped');
    };
  }, [roomId, username, createPeer, addPeer]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !t.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  }, []);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = !t.enabled;
      });
      setIsCamOff((prev) => !prev);
    }
  }, []);
  // Stop screen sharing
  const stopScreenShare = useCallback(() => {
    if (!screenStreamRef.current) return;

    screenStreamRef.current.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    setScreenStream(null);
    setIsSharing(false);

    // Camera track wapas lagao
    const cameraVideoTrack = localStreamRef.current?.getVideoTracks()[0];

    peersRef.current.forEach(({ peer }) => {
      if (peer && !peer.destroyed && cameraVideoTrack) {
        const senders = peer._pc?.getSenders();
        if (senders) {
          const videoSender = senders.find((s) => s.track?.kind === 'video');
          if (videoSender) {
            videoSender
              .replaceTrack(cameraVideoTrack)
              .catch((err) => console.error('Restore error:', err));
          }
        }
      }
    });

    socket.emit('screen-share-stopped', { roomId });
  }, [roomId]);
  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: false,
      });

      screenStreamRef.current = screen;
      setScreenStream(screen);
      setIsSharing(true);

      const screenVideoTrack = screen.getVideoTracks()[0];

      // Har peer mein video track replace karo
      peersRef.current.forEach(({ peer }) => {
        if (peer && !peer.destroyed) {
          const senders = peer._pc?.getSenders();
          if (senders) {
            const videoSender = senders.find((s) => s.track?.kind === 'video');
            if (videoSender) {
              videoSender
                .replaceTrack(screenVideoTrack)
                .then(() => console.log('Track replaced ✅'))
                .catch((err) => console.error('Replace error:', err));
            }
          }
        }
      });

      socket.emit('screen-share-started', { roomId });

      // Browser stop button se band ho
      screenVideoTrack.onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      if (err.name !== 'NotAllowedError') {
        console.error('Screen share error:', err);
      }
    }
  }, [roomId, stopScreenShare]);

  const toggleScreenShare = isSharing ? stopScreenShare : startScreenShare;
  return {
    localStream,
    screenStream,
    peers,
    isMuted,
    isCamOff,
    isSharing,
    toggleMute,
    toggleCamera,
    toggleScreenShare,
  };
}
