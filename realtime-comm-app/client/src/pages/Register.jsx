import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import styles from './Auth.module.css';

export default function Register() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.user, data.token);
      addToast(`Welcome, ${data.user.username}! 🎉`, 'success');

      // Check karo koi room link tha
      const redirect = sessionStorage.getItem('redirectAfterLogin');
      if (redirect) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirect, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>📡</div>
        <h2>Create Account</h2>
        <p className={styles.subtitle}>
          Join the real-time collaboration platform
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Username</label>
            <input
              name="username"
              type="text"
              placeholder="johndoe"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className={styles.switch}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
