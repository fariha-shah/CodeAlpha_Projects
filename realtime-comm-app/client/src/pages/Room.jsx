import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRoom } from '../context/RoomContext';
import useWebRTC from '../hooks/useWebRTC';
import useFileShare from '../hooks/useFileShare';
import useChat from '../hooks/useChat';
import VideoTile from '../components/VideoTile';
import FileShare from '../components/FileShare';
import Whiteboard from '../components/Whiteboard';
import Chat from '../components/Chat';
import { useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Users,
  Radio,
  Monitor,
  MonitorOff,
  Paperclip,
  PenLine,
  MessageSquare,
  Copy,
  Check,
} from 'lucide-react';
import styles from './Room.module.css';

export default function Room() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const { leaveRoom } = useRoom();
  const navigate = useNavigate();

  const [showFiles, setShowFiles] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [roomCopied, setRoomCopied] = useState(false);
  const {
    localStream,
    screenStream,
    peers,
    isMuted,
    isCamOff,
    isSharing,
    toggleMute,
    toggleCamera,
    toggleScreenShare,
  } = useWebRTC({ roomId, username: user?.username });

  const { files, sendFile, isSending } = useFileShare({
    roomId,
    username: user?.username,
  });

  const { messages, sendMessage } = useChat({
    roomId,
    username: user?.username,
  });

  const handleLeave = () => {
    leaveRoom();
    navigate('/dashboard');
  };

  const totalParticipants = peers.length + 1;

  const handleSidePanel = (panel) => {
    setShowFiles(panel === 'files' ? !showFiles : false);
    setShowChat(panel === 'chat' ? !showChat : false);
    setShowWhiteboard(false);
  };
  const handleCopyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setRoomCopied(true);
    setTimeout(() => setRoomCopied(false), 2000);
  };
  useEffect(() => {
    // Agar user already is room mein hai toh redirect karo
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);
  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.brand}>
          <Radio size={18} color="#6c63ff" />
          <span>CommApp</span>
        </div>
        <div className={styles.roomInfo}>
          <span className={styles.roomId}>Room: {roomId.slice(0, 13)}...</span>
          <span className={styles.participants}>
            <Users size={13} />
            {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}
          </span>
          <button className={styles.shareBtn} onClick={handleCopyRoomLink}>
            {roomCopied ? (
              <>
                <Check size={13} /> Copied!
              </>
            ) : (
              <>
                <Copy size={13} /> Share Room
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className={styles.main}>
        {/* Video Grid */}
        <div className={styles.grid}>
          {isSharing && screenStream && (
            <VideoTile
              stream={screenStream}
              username={user?.username}
              muted={true}
              isScreenShare={true}
              isSharing={true}
            />
          )}
          <VideoTile
            stream={localStream}
            username={`${user?.username} (You)`}
            muted={true}
            isCamOff={isCamOff}
            isSharing={isSharing}
          />
          {/* Remote Peers */}
          {peers.map((peer) => (
            <VideoTile
              key={peer.socketId}
              stream={peer.stream}
              username={peer.username}
              muted={false}
              isSharing={peer.isSharing || false}
            />
          ))}
        </div>

        {/* Side Panels */}
        {showFiles && (
          <div className={styles.sidebar}>
            <FileShare
              files={files}
              sendFile={sendFile}
              isSending={isSending}
            />
          </div>
        )}

        {showChat && (
          <div className={styles.sidebar}>
            <Chat messages={messages} sendMessage={sendMessage} />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={`${styles.ctrlBtn} ${isMuted ? styles.active : ''}`}
          onClick={toggleMute}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          <span>{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        <button
          className={`${styles.ctrlBtn} ${isCamOff ? styles.active : ''}`}
          onClick={toggleCamera}
        >
          {isCamOff ? <VideoOff size={20} /> : <Video size={20} />}
          <span>{isCamOff ? 'Start Video' : 'Stop Video'}</span>
        </button>

        <button
          className={`${styles.ctrlBtn} ${isSharing ? styles.sharing : ''}`}
          onClick={toggleScreenShare}
        >
          {isSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
          <span>{isSharing ? 'Stop Share' : 'Share Screen'}</span>
        </button>

        <button
          className={`${styles.ctrlBtn} ${showFiles ? styles.sharing : ''}`}
          onClick={() => handleSidePanel('files')}
        >
          <Paperclip size={20} />
          <span>Files {files.length > 0 ? `(${files.length})` : ''}</span>
        </button>

        <button
          className={`${styles.ctrlBtn} ${showChat ? styles.sharing : ''}`}
          onClick={() => handleSidePanel('chat')}
        >
          <MessageSquare size={20} />
          <span>Chat {messages.length > 0 ? `(${messages.length})` : ''}</span>
        </button>

        <button
          className={`${styles.ctrlBtn} ${showWhiteboard ? styles.sharing : ''}`}
          onClick={() => setShowWhiteboard(true)}
        >
          <PenLine size={20} />
          <span>Whiteboard</span>
        </button>

        <button
          className={`${styles.ctrlBtn} ${styles.leave}`}
          onClick={handleLeave}
        >
          <PhoneOff size={20} />
          <span>Leave</span>
        </button>
      </div>

      {/* Whiteboard Modal */}
      {showWhiteboard && (
        <Whiteboard roomId={roomId} onClose={() => setShowWhiteboard(false)} />
      )}
    </div>
  );
}
