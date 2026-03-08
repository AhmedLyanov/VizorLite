import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";
import { message } from "antd";
import RoomBoard from "../../features/roomBoard/RoomBoard";
import Chat from "../../features/chat/Chat";
import style from "./RoomPage.module.css";
import { useAuth } from "../../entities/user/AuthContext";

if (typeof window !== "undefined" && !(window as any).process) {
  (window as any).process = {
    env: {},
    nextTick: (fn: any, ...args: any[]) =>
      Promise.resolve().then(() => fn(...args)),
  };
}

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!roomId) return <div>Room not found</div>;

  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Map<string, Peer.Instance>>(new Map());
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());
  const joinedRef = useRef(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteVideos, setRemoteVideos] = useState<Map<string, MediaStream>>(
    new Map()
  );
  const [participants, setParticipants] = useState<
    Map<string, { userName: string }>
  >(new Map());
  const [userName, setUserName] = useState<string>('');

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const screenStreamRef = useRef<MediaStream | null>(null);
  const originalTrackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      })
      .catch(() => {
        message.error("Не удалось получить доступ к камере/микрофону");
      });
  }, []);

  const createPeer = (
    socketId: string,
    initiator: boolean
  ): Peer.Instance => {
    const peer = new Peer({
      initiator,
      trickle: true,
      stream: stream!,
    });

    peer.on("signal", (data: any) => {
      if (!socketRef.current) return;

      if (data.type === "offer") {
        socketRef.current.emit("offer", { offer: data, to: socketId });
      } else if (data.type === "answer") {
        socketRef.current.emit("answer", { answer: data, to: socketId });
      } else {
        socketRef.current.emit("ice-candidate", {
          candidate: data,
          to: socketId,
        });
      }
    });

    peer.on("stream", (remoteStream: MediaStream) => {
      remoteStreamsRef.current.set(socketId, remoteStream);
      setRemoteVideos(new Map(remoteStreamsRef.current));
    });

    peer.on("close", () => removePeer(socketId));
    peer.on("error", () => removePeer(socketId));

    peersRef.current.set(socketId, peer);
    return peer;
  };

  const removePeer = (socketId: string) => {
    peersRef.current.get(socketId)?.destroy();
    peersRef.current.delete(socketId);
    remoteStreamsRef.current.delete(socketId);
    setRemoteVideos(new Map(remoteStreamsRef.current));
  };

  useEffect(() => {
    if (!stream || joinedRef.current) return;
    joinedRef.current = true;

    const currentUserName = user?.username || `User ${Math.floor(Math.random() * 1000)}`;
    setUserName(currentUserName);

    const socket = io(import.meta.env.VITE_API_URL, {
      path: "/ws",
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-room", {
        roomId,
        userId: user?.id || socket.id,
        userName: currentUserName,
      });
    });

    socket.on("user-connected", ({ socketId, userName }) => {
      setParticipants((prev) => {
        const map = new Map(prev);
        map.set(socketId, { userName });
        return map;
      });

      if (!peersRef.current.has(socketId)) {
        createPeer(socketId, true);
      }
    });

    socket.on("offer", ({ offer, from }) => {
      let peer = peersRef.current.get(from);
      if (!peer) peer = createPeer(from, false);
      peer.signal(offer);
    });

    socket.on("answer", ({ answer, from }) => {
      peersRef.current.get(from)?.signal(answer);
    });

    socket.on("ice-candidate", ({ candidate, from }) => {
      peersRef.current.get(from)?.signal(candidate);
    });

    socket.on("user-disconnected", ({ socketId }) => {
      removePeer(socketId);
    });

    return () => {
      socket.disconnect();
      peersRef.current.forEach((p) => p.destroy());
      peersRef.current.clear();
    };
  }, [stream]);

  const toggleCamera = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsCameraOn((p) => !p);
  };

  const toggleScreenShare = async () => {
    if (!stream) return;

    if (!isScreenSharing) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const screenTrack = screenStream.getVideoTracks()[0];
      const cameraTrack = stream.getVideoTracks()[0];

      originalTrackRef.current = cameraTrack;
      screenStreamRef.current = screenStream;

      peersRef.current.forEach((peer) => {
        const sender = (peer as any)._pc
          ?.getSenders()
          .find((s: RTCRtpSender) => s.track === cameraTrack);
        sender?.replaceTrack(screenTrack);
      });

      stream.removeTrack(cameraTrack);
      stream.addTrack(screenTrack);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      screenTrack.onended = stopScreenShare;
      setIsScreenSharing(true);
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (!stream || !originalTrackRef.current) return;

    const screenTrack = screenStreamRef.current?.getVideoTracks()[0];
    const cameraTrack = originalTrackRef.current;

    peersRef.current.forEach((peer) => {
      const sender = (peer as any)._pc
        ?.getSenders()
        .find((s: RTCRtpSender) => s.track === screenTrack);
      sender?.replaceTrack(cameraTrack);
    });

    stream.removeTrack(screenTrack!);
    stream.addTrack(cameraTrack);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    screenStreamRef.current?.getTracks().forEach((t) => t.stop());

    setIsScreenSharing(false);
    screenStreamRef.current = null;
    originalTrackRef.current = null;
  };

  
  const handleLeaveRoom = () => {
    peersRef.current.forEach((p) => p.destroy());
    peersRef.current.clear();
    socketRef.current?.disconnect();
    stream?.getTracks().forEach((t) => t.stop());
    navigate("/");
  };


  return (
    <div className={style.containerRoom}>
      <div className={style.roomBox}>
        <div className={style.videoContainer}>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={style.roomParticipant}
          />
        </div>

        {Array.from(remoteVideos.entries()).map(([id, remoteStream]) => (
          <div key={id} className={style.videoContainer}>
            <video
              autoPlay
              playsInline
              className={style.roomParticipant}
              ref={(el) => {
                if (el) el.srcObject = remoteStream;
              }}
            />
            <div className={style.videoLabel}>
              {participants.get(id)?.userName ||
                `User ${id.slice(0, 5)}`}
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

      <Chat
        socket={socketRef.current}
        roomId={roomId}
        userId={user?.id || null}
        userName={userName}
      />
    </div>
  );
}