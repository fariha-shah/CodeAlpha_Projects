import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import styles from './Toast.module.css';

const icons = {
  success: <CheckCircle size={18} color="#6bcb77" />,
  error: <XCircle size={18} color="#ff6b6b" />,
  info: <AlertCircle size={18} color="#3ecfcf" />,
};

export function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {icons[type]}
      <span>{message}</span>
      <button className={styles.close} onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className={styles.container}>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => removeToast(t.id)}
        />
      ))}
    </div>
  );
}
