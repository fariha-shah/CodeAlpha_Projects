import { Globe, Lock, Users, ArrowRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import styles from './RoomCard.module.css';

export default function RoomCard({ room, onJoin }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e) => {
    e.stopPropagation();
    const link = `${window.location.origin}/room/${room.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.icon}>
          {room.isPrivate ? (
            <Lock size={26} color="#ffa500" />
          ) : (
            <Globe size={26} color="#3ecfcf" />
          )}
        </div>
        <span
          className={`${styles.badge} ${room.isPrivate ? styles.private : styles.public}`}
        >
          {room.isPrivate ? 'Private' : 'Public'}
        </span>
      </div>

      <h3 className={styles.name}>{room.name}</h3>

      <p className={styles.participants}>
        <Users size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
        {room.participants} participant{room.participants !== 1 ? 's' : ''}
      </p>

      {/* Room Link */}
      <div className={styles.linkBox}>
        <span className={styles.linkText}>
          {`${window.location.origin}/room/${room.id}`.slice(0, 30)}...
        </span>
        <button className={styles.copyBtn} onClick={handleCopyLink}>
          {copied ? <Check size={13} color="#6bcb77" /> : <Copy size={13} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      <button className={styles.joinBtn} onClick={() => onJoin(room)}>
        Join Room <ArrowRight size={15} />
      </button>
    </div>
  );
}
