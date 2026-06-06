import { useNavigate } from 'react-router-dom';
import { Home, Radio } from 'lucide-react';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Radio size={48} color="#6c63ff" />
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.sub}>The page you're looking for doesn't exist.</p>
        <button className={styles.btn} onClick={() => navigate('/dashboard')}>
          <Home size={16} />
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
