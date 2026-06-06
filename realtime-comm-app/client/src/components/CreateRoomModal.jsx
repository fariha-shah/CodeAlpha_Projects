import { useState } from 'react';
import { X, Lock, Globe } from 'lucide-react';
import styles from './CreateRoomModal.module.css';

export default function CreateRoomModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), isPrivate);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Create a New Room</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <p className={styles.subtitle}>Set up your collaboration space</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Room Name</label>
            <input
              type="text"
              placeholder="e.g. Design Review"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className={styles.toggle}>
            <div className={styles.toggleLabel}>
              {isPrivate ? (
                <Lock size={15} color="#ffa500" />
              ) : (
                <Globe size={15} color="#3ecfcf" />
              )}
              <span>{isPrivate ? 'Private Room' : 'Public Room'}</span>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.createBtn}>
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
