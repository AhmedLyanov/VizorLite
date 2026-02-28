import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import RoomBoard from "../../features/roomBoard/RoomBoard";
import style from "./RoomPage.module.css";
import Peer from "simple-peer";
import { message } from "antd";

if (typeof process === 'undefined') {
  (window as any).process = {
    nextTick: setTimeout,
    env: {}
  };
}

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  if (!roomId) return <div>Room not found</div>;

  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Map<string, Peer.Instance>>(new Map());
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());
  const joinedRef = useRef(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteVideos, setRemoteVideos] = useState<Map<string, MediaStream>>(new Map());
  const [participants, setParticipants] = useState<Map<string, { userName: string }>>(new Map());

  const screenStreamRef = useRef<MediaStream | null>(null);
  const originalVideoTrackRef = useRef<MediaStreamTrack | null>(null);
  const originalStreamRef = useRef<MediaStream | null>(null); 

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        originalStreamRef.current = mediaStream; 
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
        message.error("Не удалось получить доступ к камере/микрофону");
      });
  }, []);

  const toggleCamera = () => {
    if (!stream) return;
    const videoTracks = stream.getVideoTracks();
    videoTracks.forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsCameraOn(prev => !prev);
  };

  const updateAllPeersStream = (newStream: MediaStream) => {
    peersRef.current.forEach((peer) => {
      try {
        if (typeof (peer as any).removeStream === 'function') {
          (peer as any).removeStream(originalStreamRef.current || stream);
        }
        if (typeof (peer as any).addStream === 'function') {
          (peer as any).addStream(newStream);
        }
      } catch (e) {
        console.warn('Failed to update peer stream:', e);
      }
    });
  };

  const toggleScreenShare = async () => {
    if (!stream) return;

    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: "always" } as MediaTrackConstraints,
          audio: false,
        });

        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];

        originalVideoTrackRef.current = stream.getVideoTracks()[0] || null;

        const newStream = new MediaStream([
          screenTrack,
          ...stream.getAudioTracks()
        ]);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = newStream;
        }

        updateAllPeersStream(newStream);

        screenTrack.onended = () => {
          stopScreenShare();
        };

        setIsScreenSharing(true);
      } else {
        stopScreenShare();
      }
    } catch (err: any) {
      if (err?.name !== "NotAllowedError") {
        console.error("Screen share error:", err);
        message.error("Не удалось начать демонстрацию экрана");
      }
    }
  };

  const stopScreenShare = () => {
    if (originalVideoTrackRef.current && originalStreamRef.current) {
      const restoredStream = new MediaStream([
        originalVideoTrackRef.current,
        ...originalStreamRef.current.getAudioTracks()
      ]);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = restoredStream;
      }

      updateAllPeersStream(restoredStream);
    }

    screenStreamRef.current?.getTracks().forEach(track => track.stop());
    screenStreamRef.current = null;
    originalVideoTrackRef.current = null;
    setIsScreenSharing(false);
  };

  const createPeerConnection = (socketId: string, initiator: boolean): Peer.Instance => {
    const currentStream = isScreenSharing && screenStreamRef.current
      ? new MediaStream([
          screenStreamRef.current.getVideoTracks()[0],
          ...(stream?.getAudioTracks() || [])
        ])
      : stream!;

    const peer = new Peer({
      initiator,
      trickle: true,
      stream: currentStream,
    });

    peer.on("signal", (signalData: any) => {
      if (!socketRef.current) return;
      if (signalData.type === 'offer') {
        socketRef.current.emit("offer", { offer: signalData, to: socketId });
      } else if (signalData.type === 'answer') {
        socketRef.current.emit("answer", { answer: signalData, to: socketId });
      } else if (signalData.type === 'candidate') {
        socketRef.current.emit("ice-candidate", { candidate: signalData, to: socketId });
      }
    });

    peer.on("stream", (remoteStream) => {
      remoteStreamsRef.current.set(socketId, remoteStream);
      setRemoteVideos(new Map(remoteStreamsRef.current));
    });

    peer.on("close", () => cleanupPeer(socketId));
    peer.on("error", () => cleanupPeer(socketId));

    peersRef.current.set(socketId, peer);
    return peer;
  };

  const cleanupPeer = (socketId: string) => {
    const peer = peersRef.current.get(socketId);
    if (peer) {
      peer.destroy();
      peersRef.current.delete(socketId);
    }
    remoteStreamsRef.current.delete(socketId);
    setRemoteVideos(new Map(remoteStreamsRef.current));
    setParticipants(prev => {
      const newMap = new Map(prev);
      newMap.delete(socketId);
      return newMap;
    });
  };

  const handleLeaveRoom = () => {
    if (isScreenSharing) stopScreenShare();
    peersRef.current.forEach(peer => peer.destroy());
    peersRef.current.clear();
    remoteStreamsRef.current.clear();
    if (socketRef.current) socketRef.current.disconnect();
    if (stream) stream.getTracks().forEach(track => track.stop());
    navigate('/');
  };

  useEffect(() => {
    if (!stream || joinedRef.current) return;
    joinedRef.current = true;

    const socket = io(import.meta.env.VITE_API_URL, {
      path: "/ws",
      transports: ["websocket"],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-room", {
        roomId,
        userId: socket.id,
        userName: `User ${Math.floor(Math.random() * 1000)}`,
      });
    });

    socket.on("user-connected", ({ socketId, userName }) => {
      setParticipants(prev => {
        const newMap = new Map(prev);
        newMap.set(socketId, { userName });
        return newMap;
      });
      if (!peersRef.current.has(socketId)) {
        createPeerConnection(socketId, true);
      }
    });

    socket.on("offer", ({ offer, from }) => {
      let peer = peersRef.current.get(from);
      if (!peer) peer = createPeerConnection(from, false);
      peer.signal(offer);
    });

    socket.on("answer", ({ answer, from }) => {
      const peer = peersRef.current.get(from);
      if (peer) peer.signal(answer);
    });

    socket.on("ice-candidate", ({ candidate, from }) => {
      const peer = peersRef.current.get(from);
      if (peer) peer.signal(candidate);
    });

    socket.on("existing-users", ({ users }) => {
      users.forEach((user: { socketId: string; userName: string }) => {
        setParticipants(prev => {
          const newMap = new Map(prev);
          newMap.set(user.socketId, { userName: user.userName });
          return newMap;
        });
      });
    });

    socket.on("user-disconnected", ({ socketId }) => {
      cleanupPeer(socketId);
    });

    return () => {
      socket.disconnect();
      peersRef.current.forEach(peer => peer.destroy());
      peersRef.current.clear();
      remoteStreamsRef.current.clear();
    };
  }, [stream, roomId]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  return (
    <div className={style.containerRoom}>
      <div className={style.roomBox}>
        <div className={style.videoContainer}>
          <video
            className={style.roomParticipant}
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
          />
        </div>
        {Array.from(remoteVideos.entries()).map(([socketId, stream]) => (
          <div key={socketId} className={style.videoContainer}>
            <video
              className={style.roomParticipant}
              autoPlay
              playsInline
              ref={(el) => { if (el) el.srcObject = stream; }}
            />
            <div className={style.videoLabel}>
              {participants.get(socketId)?.userName || `User ${socketId.slice(0, 5)}`}
            </div>
          </div>
        ))}
      </div>
      <RoomBoard
        stream={stream}
        onLeaveRoom={handleLeaveRoom}
        onToggleCamera={toggleCamera}
        isCameraOn={isCameraOn}
        onToggleScreenShare={toggleScreenShare}
        isScreenSharing={isScreenSharing}
      />
    </div>
  );
}