import { useState, useEffect, useCallback } from 'react';
import socket from '../api/socket';

export default function useFileShare({ roomId, username }) {
  const [files, setFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    socket.on('file-received', (fileInfo) => {
      setFiles((prev) => [...prev, { ...fileInfo, isMine: false }]);
    });

    return () => {
      socket.off('file-received');
    };
  }, []);

  const sendFile = useCallback(
    (file) => {
      if (!file) return;

      // 10MB limit
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be under 10MB');
        return;
      }

      setIsSending(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target.result;

        socket.emit('file-share', {
          roomId,
          fileData,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          sender: username,
        });

        // Add to own list too
        setFiles((prev) => [
          ...prev,
          {
            fileData,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            sender: username,
            timestamp: new Date().toISOString(),
            isMine: true,
          },
        ]);

        setIsSending(false);
      };

      reader.readAsDataURL(file);
    },
    [roomId, username]
  );

  return { files, sendFile, isSending };
}
