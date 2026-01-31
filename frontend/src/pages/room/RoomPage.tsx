import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  if (!roomId) return <div>Room not found</div>;

  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const joinedRef = useRef(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [role, setRole] = useState<"initiator" | "receiver" | null>(null);
  const [otherSocketId, setOtherSocketId] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      });
  }, []);

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
      socket.emit("join-room", {
        roomId,
        userId: socket.id,
        userName: "User",
      });
    });

    socket.on("room-role", ({ role }) => {
      console.log("🎭 role:", role);
      setRole(role);
    });

    socket.on("user-connected", ({ socketId }) => {
      console.log("➕ user connected:", socketId);
      setOtherSocketId(socketId);
    });

    socket.on("offer", ({ offer, from }) => {
      if (peerRef.current) return;

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
      });

      peer.on("signal", (answer) => {
        socket.emit("answer", { answer, to: from });
      });

      peer.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      peer.signal(offer);
      peerRef.current = peer;
    });

    socket.on("answer", ({ answer }) => {
      peerRef.current?.signal(answer);
    });

    return () => {
      socket.disconnect();
      peerRef.current?.destroy();
    };
  }, [stream, roomId]);

  useEffect(() => {
    if (role !== "initiator") return;
    if (!stream || !otherSocketId) return;
    if (peerRef.current) return;

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (offer) => {
      socketRef.current?.emit("offer", {
        offer,
        to: otherSocketId,
      });
    });

    peer.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    peerRef.current = peer;
  }, [role, otherSocketId, stream]);


  
  return (
    <div style={{ padding: 24 }}>
      <h2>Комната: {roomId}</h2>
      <p>Роль: {role}</p>

      <div style={{ display: "flex", gap: 20 }}>
        <video ref={localVideoRef} autoPlay muted playsInline width={300} />
        <video ref={remoteVideoRef} autoPlay playsInline width={300} />
      </div>
    </div>
  );
}
