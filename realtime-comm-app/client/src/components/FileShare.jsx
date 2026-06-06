import { useRef } from 'react';
import {
  Paperclip,
  Download,
  FileText,
  Image,
  Film,
  Music,
  Archive,
  Send,
} from 'lucide-react';
import styles from './FileShare.module.css';

const getFileIcon = (fileType) => {
  if (fileType?.startsWith('image/'))
    return <Image size={20} color="#3ecfcf" />;
  if (fileType?.startsWith('video/')) return <Film size={20} color="#a78bfa" />;
  if (fileType?.startsWith('audio/'))
    return <Music size={20} color="#f472b6" />;
  if (fileType?.includes('zip') || fileType?.includes('rar'))
    return <Archive size={20} color="#fb923c" />;
  return <FileText size={20} color="#6c63ff" />;
};

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function FileShare({ files, sendFile, isSending }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) sendFile(file);
    e.target.value = '';
  };

  const handleDownload = (fileData, fileName) => {
    const a = document.createElement('a');
    a.href = fileData;
    a.download = fileName;
    a.click();
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <Paperclip size={16} />
        <span>Shared Files</span>
        <span className={styles.count}>{files.length}</span>
      </div>

      {/* File List */}
      <div className={styles.fileList}>
        {files.length === 0 ? (
          <div className={styles.empty}>
            <Paperclip size={32} color="#444" />
            <p>No files shared yet</p>
            <span>Share a file with everyone in the room</span>
          </div>
        ) : (
          files.map((file, index) => (
            <div
              key={index}
              className={`${styles.fileItem} ${file.isMine ? styles.mine : styles.theirs}`}
            >
              <div className={styles.fileIcon}>
                {getFileIcon(file.fileType)}
              </div>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.fileName}</span>
                <span className={styles.fileMeta}>
                  {formatSize(file.fileSize)} •{' '}
                  {file.isMine ? 'You' : file.sender} •{' '}
                  {formatTime(file.timestamp)}
                </span>
              </div>
              <button
                className={styles.downloadBtn}
                onClick={() => handleDownload(file.fileData, file.fileName)}
                title="Download"
              >
                <Download size={15} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Upload Button */}
      <div className={styles.footer}>
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          className={styles.uploadBtn}
          onClick={() => inputRef.current.click()}
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Send size={15} /> Sending...
            </>
          ) : (
            <>
              <Paperclip size={15} /> Share File
            </>
          )}
        </button>
        <span className={styles.limit}>Max 10MB</span>
      </div>
    </div>
  );
}
