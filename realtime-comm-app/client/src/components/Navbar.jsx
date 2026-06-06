import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Radio, LogOut } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <Radio size={22} color="#6c63ff" />
        <span className={styles.name}>CommApp</span>
      </div>
      <div className={styles.right}>
        <div className={styles.avatar}>
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <span className={styles.username}>{user?.username}</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </nav>
  );
}
