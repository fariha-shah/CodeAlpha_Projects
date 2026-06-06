import { createContext, useContext, useState, useEffect } from 'react';
import socket from '../api/socket';

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  // Socket se real participant count update karo
  useEffect(() => {
    socket.on('user-joined', ({ socketId, roomId }) => {
      // Apne aap ko count mein mat add karo
      if (socketId === socket.id) return;

      setRooms((prev) =>
        prev.map((r) =>
          r.id === roomId ? { ...r, participants: r.participants + 1 } : r
        )
      );
    });

    socket.on('user-left', ({ roomId }) => {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === roomId && r.participants > 0
            ? { ...r, participants: r.participants - 1 }
            : r
        )
      );
    });

    return () => {
      socket.off('user-joined');
      socket.off('user-left');
    };
  }, []);

  const createRoom = (name, isPrivate) => {
    const newRoom = {
      id: `room-${Date.now()}`,
      name,
      participants: 0, // real join hone par count badhega
      isPrivate,
    };
    setRooms((prev) => [...prev, newRoom]);
    return newRoom;
  };

  const joinRoom = (room) => {
    setCurrentRoom(room);
    // Participant count badhao jab join karo
    setRooms((prev) =>
      prev.map((r) =>
        r.id === room.id ? { ...r, participants: r.participants + 1 } : r
      )
    );
  };

  const leaveRoom = () => {
    if (currentRoom) {
      // Participant count ghata do jab leave karo
      setRooms((prev) =>
        prev.map((r) =>
          r.id === currentRoom.id && r.participants > 0
            ? { ...r, participants: r.participants - 1 }
            : r
        )
      );
    }
    setCurrentRoom(null);
  };

  return (
    <RoomContext.Provider
      value={{ rooms, currentRoom, createRoom, joinRoom, leaveRoom }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
