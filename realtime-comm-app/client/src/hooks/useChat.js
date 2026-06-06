import { useState, useEffect, useCallback } from 'react';
import socket from '../api/socket';
import { encrypt, decrypt } from '../utils/encryption';

export default function useChat({ roomId, username }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message-received', ({ encryptedMsg, sender, timestamp }) => {
      try {
        const decrypted = decrypt(encryptedMsg, roomId);
        setMessages((prev) => [
          ...prev,
          {
            text: decrypted,
            sender,
            timestamp,
            isMine: false,
            encrypted: true,
          },
        ]);
      } catch (err) {
        console.error('Decryption failed:', err);
      }
    });

    return () => socket.off('message-received');
  }, [roomId]);

  const sendMessage = useCallback(
    (text) => {
      if (!text.trim()) return;

      const encryptedMsg = encrypt(text, roomId);
      const timestamp = new Date().toISOString();

      socket.emit('send-message', {
        roomId,
        encryptedMsg,
        sender: username,
        timestamp,
      });

      setMessages((prev) => [
        ...prev,
        {
          text,
          sender: username,
          timestamp,
          isMine: true,
          encrypted: true,
        },
      ]);
    },
    [roomId, username]
  );

  return { messages, sendMessage };
}
