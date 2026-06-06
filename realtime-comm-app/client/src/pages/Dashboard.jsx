import { useState } from 'react';
import { Users, Globe, Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRoom } from '../context/RoomContext';
import Navbar from '../components/Navbar';
import RoomCard from '../components/RoomCard';
import CreateRoomModal from '../components/CreateRoomModal';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { rooms, createRoom, joinRoom } = useRoom();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleCreate = (name, isPrivate) => {
    const room = createRoom(name, isPrivate);
    joinRoom(room);
    navigate(`/room/${room.id}`);
  };

  const handleJoin = (room) => {
    joinRoom(room);
    navigate(`/room/${room.id}`);
  };

  const filtered = rooms.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>
        {/* Hero */}
        <div className={styles.hero}>
          <h1>
            Good to see you, <span>{user?.username}</span>
          </h1>
          <p>Create or join a room to start collaborating in real-time</p>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{rooms.length}</span>
            <span className={styles.statLabel}>
              <Globe size={12} /> Total Rooms
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>
              {rooms.filter((r) => !r.isPrivate).length}
            </span>
            <span className={styles.statLabel}>
              <Globe size={12} /> Public Rooms
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>
              {rooms.reduce((a, r) => a + r.participants, 0)}
            </span>
            <span className={styles.statLabel}>
              <Users size={12} /> Active Users
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <Search size={15} className={styles.searchIcon} />
            <input
              className={styles.search}
              type="text"
              placeholder="Search rooms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className={styles.createBtn}
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} /> Create Room
          </button>
        </div>

        {/* Room Grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((room) => (
              <RoomCard key={room.id} room={room} onJoin={handleJoin} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>😕 No rooms found. Create one to get started!</p>
          </div>
        )}
      </div>

      {showModal && (
        <CreateRoomModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
