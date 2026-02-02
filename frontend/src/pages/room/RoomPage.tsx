import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import style from "./RoomPage.module.css";
import Peer from "simple-peer";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  if (!roomId) return <div>Room not found</div>;

  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Map<string, Peer.Instance>>(new Map());
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());
  const pendingConnectionsRef = useRef<Map<string, boolean>>(new Map());
  const joinedRef = useRef(false);
  
  // Используем useRef для role, чтобы он был доступен в обработчиках событий
  const roleRef = useRef<"initiator" | "receiver" | null>(null);
  const existingUsersReceivedRef = useRef(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [role, setRoleState] = useState<"initiator" | "receiver" | null>(null);
  const [remoteVideos, setRemoteVideos] = useState<Map<string, MediaStream>>(new Map());
  const [participants, setParticipants] = useState<Map<string, { userName: string }>>(new Map());

  // Функция для установки роли
  const setRole = (newRole: "initiator" | "receiver" | null) => {
    roleRef.current = newRole;
    setRoleState(newRole);
  };

  // Получение медиапотока
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
        alert("Не удалось получить доступ к камере/микрофону");
      });
  }, []);

  // Создание peer соединения
  const createPeerConnection = (socketId: string, initiator: boolean): Peer.Instance => {
    console.log(`🔗 Creating peer connection with ${socketId}, initiator: ${initiator}, my role: ${roleRef.current}`);
    
    // Если пир уже существует, возвращаем его
    if (peersRef.current.has(socketId)) {
      console.log(`⏭️ Peer with ${socketId} already exists`);
      return peersRef.current.get(socketId)!;
    }
    
    const peer = new Peer({
      initiator,
      trickle: false,
      stream: stream!,
    });

    peer.on("signal", (signalData) => {
      if (!socketRef.current) return;
      
      if (initiator) {
        console.log(`📤 Sending offer to ${socketId} (my role: ${roleRef.current})`);
        socketRef.current.emit("offer", { 
          offer: signalData, 
          to: socketId 
        });
      } else {
        console.log(`📤 Sending answer to ${socketId} (my role: ${roleRef.current})`);
        socketRef.current.emit("answer", { 
          answer: signalData, 
          to: socketId 
        });
      }
    });

    peer.on("stream", (remoteStream) => {
      console.log(`🎥 Received stream from ${socketId}`);
      remoteStreamsRef.current.set(socketId, remoteStream);
      setRemoteVideos(new Map(remoteStreamsRef.current));
    });

    peer.on("connect", () => {
      console.log(`✅ Peer connection established with ${socketId}`);
      pendingConnectionsRef.current.delete(socketId);
    });

    peer.on("close", () => {
      console.log(`❌ Peer connection closed with ${socketId}`);
      cleanupPeer(socketId);
    });

    peer.on("error", (err) => {
      console.error(`⚠️ Peer error with ${socketId}:`, err.message);
      cleanupPeer(socketId);
    });

    peersRef.current.set(socketId, peer);
    pendingConnectionsRef.current.set(socketId, true);
    return peer;
  };

  // Очистка пира
  const cleanupPeer = (socketId: string) => {
    const peer = peersRef.current.get(socketId);
    if (peer) {
      peer.destroy();
      peersRef.current.delete(socketId);
    }
    remoteStreamsRef.current.delete(socketId);
    pendingConnectionsRef.current.delete(socketId);
    setRemoteVideos(new Map(remoteStreamsRef.current));
  };

  // Подключение к комнате и обработка событий
  useEffect(() => {
    if (!stream || joinedRef.current) return;
    joinedRef.current = true;

    const socket = io("http://localhost:3000", {
      path: "/ws",
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Connected to WebSocket server:", socket.id);
      socket.emit("join-room", {
        roomId,
        userId: socket.id,
        userName: `User ${Math.floor(Math.random() * 1000)}`,
      });
    });

    socket.on("room-role", ({ role: newRole }) => {
      console.log("🎭 Role assigned:", newRole);
      setRole(newRole);
      
      // Если мы initiator и уже получили список существующих пользователей,
      // создаем соединения с ними
      if (newRole === "initiator" && existingUsersReceivedRef.current) {
        console.log("🎯 Initiator: processing pending connections");
        // Обработка будет в existing-users
      }
    });

    socket.on("user-connected", ({ socketId, userId, userName }) => {
      console.log("➕ User connected:", socketId, userName);
      
      // Добавляем пользователя в список участников
      setParticipants(prev => {
        const newMap = new Map(prev);
        newMap.set(socketId, { userName });
        return newMap;
      });
      
      // ТОЛЬКО initiator создает соединение с новыми пользователями
      if (roleRef.current === "initiator" && !peersRef.current.has(socketId)) {
        console.log(`🎯 Initiator creating peer with new user ${socketId}`);
        createPeerConnection(socketId, true);
      } else {
        console.log(`⏳ ${roleRef.current || 'Unknown'} waiting for offer from ${socketId}`);
      }
    });

    socket.on("offer", ({ offer, from }) => {
      console.log(`📥 Received offer from ${from} (my role: ${roleRef.current})`);
      
      // Если мы уже создали peer как initiator, это нормально
      const existingPeer = peersRef.current.get(from);
      if (existingPeer && existingPeer.initiator) {
        console.log(`✅ Already have initiator peer with ${from}, ignoring offer`);
        return;
      }
      
      if (!peersRef.current.has(from)) {
        console.log(`🆕 Creating receiver peer for ${from}`);
        const peer = createPeerConnection(from, false);
        setTimeout(() => {
          peer.signal(offer);
        }, 100);
      } else {
        // Если peer уже существует (возможно созданный в existing-users), обрабатываем offer
        existingPeer?.signal(offer);
      }
    });

    socket.on("answer", ({ answer, from }) => {
      console.log(`📥 Received answer from ${from} (my role: ${roleRef.current})`);
      
      const peer = peersRef.current.get(from);
      if (peer) {
        peer.signal(answer);
      } else {
        console.warn(`⚠️ No peer found for ${from}, but received answer`);
      }
    });

    socket.on("existing-users", ({ users }) => {
      console.log("👥 Existing users in room:", users);
      existingUsersReceivedRef.current = true;
      
      users.forEach((user: { socketId: string; userName: string }) => {
        setParticipants(prev => {
          const newMap = new Map(prev);
          newMap.set(user.socketId, { userName: user.userName });
          return newMap;
        });
        
        // ВАЖНО: Ждем пока получим роль
        setTimeout(() => {
          console.log(`🤔 Processing existing user ${user.socketId}, my role: ${roleRef.current}`);
          
          // ТОЛЬКО initiator создает соединения с существующими пользователями
          if (roleRef.current === "initiator" && !peersRef.current.has(user.socketId)) {
            console.log(`🎯 Initiator creating peer with existing user ${user.socketId}`);
            createPeerConnection(user.socketId, true);
          } else if (roleRef.current === "receiver") {
            console.log(`⏳ Receiver waiting for offer from existing user ${user.socketId}`);
            // Receiver ничего не делает - ждет offer
          } else if (!roleRef.current) {
            console.log(`⏳ Role not set yet, deferring connection to ${user.socketId}`);
            // Роль еще не установлена, подождем
          }
        }, 500); // Даем время на получение роли
      });
    });

    socket.on("user-disconnected", ({ socketId }) => {
      console.log("➖ User disconnected:", socketId);
      
      // Удаляем из списка участников
      setParticipants(prev => {
        const newMap = new Map(prev);
        newMap.delete(socketId);
        return newMap;
      });

      // Закрываем пир-соединение
      cleanupPeer(socketId);
    });

    return () => {
      console.log("🧹 Cleaning up connections");
      socket.disconnect();
      
      // Очистка всех пиров
      peersRef.current.forEach((peer) => {
        peer.destroy();
      });
      peersRef.current.clear();
      remoteStreamsRef.current.clear();
      pendingConnectionsRef.current.clear();
    };
  }, [stream, roomId]); // Убрали role из зависимостей

  // Очистка медиапотока при размонтировании
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className={style.containerRoom}>
      <div className={style.roomHeader}>
        <h2>Комната: {roomId}</h2>
        <div className={style.participantsCount}>
          Участников: {participants.size + 1} {role && `(Вы - ${role})`}
        </div>
      </div>

      <div className={style.roomBox}>
        {/* Локальное видео */}
        <div className={style.videoContainer}>
          <video 
            className={style.roomParticipant} 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline 
          />
          <div className={style.videoLabel}>
            Вы {role && `(${role})`}
          </div>
        </div>

        {/* Все удаленные видео */}
        {Array.from(remoteVideos.entries()).map(([socketId, stream]) => (
          <div key={socketId} className={style.videoContainer}>
            <video
              className={style.roomParticipant}
              autoPlay
              playsInline
              ref={(el) => {
                if (el) {
                  el.srcObject = stream;
                }
              }}
            />
            <div className={style.videoLabel}>
              {participants.get(socketId)?.userName || `User ${socketId.slice(0, 5)}`}
            </div>
          </div>
        ))}

        {remoteVideos.size === 0 && (
          <div className={style.emptyState}>
            <p>Ожидание других участников...</p>
            <p>Ваша роль: {role || "определяется..."}</p>
          </div>
        )}
      </div>
      
    </div>
  );
}