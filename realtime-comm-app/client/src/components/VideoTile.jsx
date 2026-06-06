import { useEffect, useRef } from 'react';
import { VideoOff, MicOff, Monitor } from 'lucide-react';
import styles from './VideoTile.module.css';

export default function VideoTile({
  stream,
  username,
  muted = false,
  isCamOff = false,
  isSharing = false,
  isScreenShare = false,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`${styles.tile} ${isScreenShare ? styles.screenTile : ''}`}>
      {isSharing && (
        <div className={styles.sharingBadge}>
          <Monitor size={12} /> Sharing Screen
        </div>
      )}

      {stream && !isCamOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className={styles.video}
        />
      ) : (
        <div className={styles.noVideo}>
          <div className={styles.avatar}>
            {username?.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      <div className={styles.overlay}>
        <span className={styles.name}>
          {isScreenShare ? `${username}'s Screen` : username}
        </span>
        <div className={styles.icons}>
          {muted && <MicOff size={13} color="#ff6b6b" />}
          {isCamOff && <VideoOff size={13} color="#ff6b6b" />}
          {isSharing && <Monitor size={13} color="#3ecfcf" />}
        </div>
      </div>
    </div>
  );
}
