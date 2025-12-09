import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Room {
  id: string;
  roomId: string;
  name: string;
  description: string;
  owner: {
    username: string;
  };
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState('');

  React.useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rooms');
      setRooms(res.data.rooms);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/rooms',
        {
          name: roomName,
          description: roomDescription,
          isPublic
        },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );

      navigate(`/room/${res.data.room.roomId}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.errors[0]?.msg || 'Failed to create room';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="dashboard">
      <header>
        <h1>VizorLite Dashboard</h1>
        <div className="user-actions">
          <span>Welcome, {user?.username}!</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main>
        <section className="create-room-section">
          <h2>Create New Room</h2>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleCreateRoom}>
            <div className="form-group">
              <label htmlFor="roomName">Room Name</label>
              <input
                id="roomName"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter room name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="roomDescription">Description</label>
              <input
                id="roomDescription"
                type="text"
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
                disabled={loading}
                placeholder="Enter room description (optional)"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  disabled={loading}
                />
                Make this room public
              </label>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Creating room...' : 'Create Room'}
            </button>
          </form>
        </section>

        <section className="existing-rooms-section">
          <h2>Public Rooms</h2>
          {rooms.length > 0 ? (
            <div className="rooms-list">
              {rooms.map((room) => (
                <div key={room.id} className="room-card">
                  <h3>{room.name}</h3>
                  <p>{room.description || 'No description'}</p>
                  <p>Created by: {room.owner.username}</p>
                  <p>Room ID: {room.roomId}</p>
                  <button onClick={() => joinRoom(room.roomId)}>Join Room</button>
                </div>
              ))}
            </div>
          ) : (
            <p>No public rooms available</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;