import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import styles from './VideoRoom.module.css';

interface Participant {
  userId: string;
  socketId: string;
  userName: string;
}

const VideoRoom: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());

  useEffect(() => {
    const initRoom = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const newSocket = io('http://localhost:3000', {
          withCredentials: true
        });
        setSocket(newSocket);

        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('username') || 'Пользователь';

        newSocket.on('connect', () => {
          newSocket.emit('join-room', {
            roomId,
            userId,
            userName
          });
        });

        newSocket.on('user-connected', (data) => {
          console.log('Пользователь подключился:', data);
          handleUserConnected(data);
        });

        newSocket.on('user-disconnected', (data) => {
          console.log('Пользователь отключился:', data);
          handleUserDisconnected(data.socketId);
        });

        newSocket.on('offer', handleOffer);
        newSocket.on('answer', handleAnswer);
        newSocket.on('ice-candidate', handleIceCandidate);

      } catch (error) {
        console.error('Ошибка инициализации комнаты:', error);
        alert('Не удалось получить доступ к камере/микрофону');
      }
    };

    initRoom();

    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomId]);

  const handleUserConnected = async (userData: any) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });

    peerConnections.current.set(userData.socketId, pc);

    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    socket?.emit('offer', {
      offer,
      to: userData.socketId
    });

    pc.ontrack = (event) => {
      const videoElement = document.getElementById(`video-${userData.socketId}`) as HTMLVideoElement;
      if (videoElement && event.streams[0]) {
        videoElement.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('ice-candidate', {
          candidate: event.candidate,
          to: userData.socketId
        });
      }
    };

    setParticipants(prev => [...prev, userData]);
  };

  const handleOffer = async (data: any) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });

    peerConnections.current.set(data.from, pc);

    await pc.setRemoteDescription(new RTCSessionDescription(data.offer));

    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    socket?.emit('answer', {
      answer,
      to: data.from
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('ice-candidate', {
          candidate: event.candidate,
          to: data.from
        });
      }
    };
  };

  const handleAnswer = async (data: any) => {
    const pc = peerConnections.current.get(data.from);
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    }
  };

  const handleIceCandidate = async (data: any) => {
    const pc = peerConnections.current.get(data.from);
    if (pc && data.candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  const handleUserDisconnected = (socketId: string) => {
    const pc = peerConnections.current.get(socketId);
    if (pc) {
      pc.close();
      peerConnections.current.delete(socketId);
    }
    setParticipants(prev => prev.filter(p => p.socketId !== socketId));
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const leaveRoom = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h2>Комната: {roomId}</h2>
      
      <div className={styles.videoGrid}>
        <div className={styles.videoContainer}>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className={styles.video}
          />
          <div className={styles.videoLabel}>
            Вы {!videoEnabled && '(Камера выкл)'} {!audioEnabled && '(Микрофон выкл)'}
          </div>
        </div>

        {participants.map(participant => (
          <div key={participant.socketId} className={styles.videoContainer}>
            <video
              id={`video-${participant.socketId}`}
              autoPlay
              className={styles.video}
            />
            <div className={styles.videoLabel}>
              {participant.userName}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button onClick={toggleVideo} className={styles.controlButton}>
          {videoEnabled ? 'Выкл камеру' : 'Вкл камеру'}
        </button>
        <button onClick={toggleAudio} className={styles.controlButton}>
          {audioEnabled ? '🎤ыкл микрофон' : 'Вкл микрофон'}
        </button>
        <button onClick={leaveRoom} className={`${styles.controlButton} ${styles.leaveButton}`}>
          Покинуть комнату
        </button>
      </div>
    </div>
  );
};

export default VideoRoom;