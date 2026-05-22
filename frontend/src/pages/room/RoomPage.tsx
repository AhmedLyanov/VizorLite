import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";
import { message } from "antd";

import { RoomControlPanel } from "@/widgets/roomControlPanel";
import { Chat } from "@/features/chat";
import { useAuth } from "@/entities/user";
import { useGridLayout } from "@/entities/grid";
import { useFullscreen } from "@/shared/hooks";
import fullscreenOff from "@/shared/assets/fullscreenOff.svg";
import fullscreenOn from "@/shared/assets/fullscreenOn.svg";

import style from "./RoomPage.module.css";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const peersRef = useRef<Map<string, Peer.Instance>>(new Map());
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());
  const joinedRef = useRef(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteVideos, setRemoteVideos] = useState<Map<string, MediaStream>>(
    new Map(),
  );
  const [participants, setParticipants] = useState<
    Map<string, { userName: string }>
  >(new Map());
  const [userName, setUserName] = useState<string>("");

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const screenStreamRef = useRef<MediaStream | null>(null);
  const originalTrackRef = useRef<MediaStreamTrack | null>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  const { fullscreenTarget, exitFullscreen, toggleFullscreen } = useFullscreen({
    autoEnterOnScreenShare: true,
  });

  const [participantCount, setParticipantCount] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const { layout, videoSize } = useGridLayout(gridRef, participantCount);

  useEffect(() => {
    if (isScreenSharing && gridContainerRef.current && !document.fullscreenElement) {
      gridContainerRef.current.requestFullscreen().catch(() => { });
    }
  }, [isScreenSharing]);

  useEffect(() => {
    setParticipantCount(1 + remoteVideos.size);
  }, [remoteVideos]);

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

  const removePeer = useCallback((socketId: string) => {
    peersRef.current.get(socketId)?.destroy();
    peersRef.current.delete(socketId);
    remoteStreamsRef.current.delete(socketId);
    setRemoteVideos(new Map(remoteStreamsRef.current));
    setParticipants((prev) => {
      const map = new Map(prev);
      map.delete(socketId);
      return map;
    });
  }, []);

  const createPeer = useCallback(
    (socketId: string, initiator: boolean): Peer.Instance => {
      const peer = new Peer({
        initiator,
        trickle: true,
        stream: stream!,
      });

      peer.on(
        "signal",
        (data: {
          type: string;
          sdp?: string;
          candidate?: RTCIceCandidateInit;
        }) => {
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
        },
      );

      peer.on("stream", (remoteStream: MediaStream) => {
        remoteStreamsRef.current.set(socketId, remoteStream);
        setRemoteVideos(new Map(remoteStreamsRef.current));
      });

      peer.on("close", () => removePeer(socketId));
      peer.on("error", () => removePeer(socketId));

      peersRef.current.set(socketId, peer);
      return peer;
    },
    [stream, removePeer],
  );

  useEffect(() => {
    if (!stream || joinedRef.current) return;
    joinedRef.current = true;

    const currentUserName =
      user?.username || `User ${Math.floor(Math.random() * 1000)}`;
    setUserName(currentUserName);

    const socket = io(import.meta.env.VITE_API_URL, {
      path: "/ws",
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;
    setSocket(socket);

    socket.on("connect", () => {
      socket.emit("join-room", {
        roomId,
        userId: user?.id || socket.id,
        userName: currentUserName,
      });
    });

    socket.on(
      "existing-users",
      ({
        users,
      }: {
        users: Array<{
          socketId: string;
          userName: string;
        }>;
      }) => {
        users.forEach(({ socketId, userName }) => {
          setParticipants((prev) => {
            const map = new Map(prev);
            map.set(socketId, { userName });
            return map;
          });

          if (!peersRef.current.has(socketId)) {
            createPeer(socketId, true);
          }
        });
      },
    );

    socket.on("user-connected", ({ socketId, userName }) => {
      setParticipants((prev) => {
        const map = new Map(prev);
        map.set(socketId, { userName });
        return map;
      });
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
      const currentPeers = new Map(peersRef.current);
      socket.disconnect();
      currentPeers.forEach((p) => p.destroy());
      peersRef.current.clear();
      setSocket(null);
    };
  }, [stream, roomId, user?.id, user?.username, createPeer, removePeer]);

  const toggleCamera = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsCameraOn((p) => !p);
  };

  const toggleScreenShare = async () => {
    if (!stream) return;

    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        const screenTrack = screenStream.getVideoTracks()[0];
        const cameraTrack = stream.getVideoTracks()[0];

        originalTrackRef.current = cameraTrack;
        screenStreamRef.current = screenStream;

        peersRef.current.forEach((peer) => {
          const sender = (
            peer as Peer.Instance & { _pc: RTCPeerConnection }
          )._pc
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
      } catch {
        message.error("Не удалось начать демонстрацию экрана");
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (!stream || !originalTrackRef.current) return;

    const screenTrack = screenStreamRef.current?.getVideoTracks()[0];
    const cameraTrack = originalTrackRef.current;

    peersRef.current.forEach((peer) => {
      const sender = (peer as Peer.Instance & { _pc: RTCPeerConnection })._pc
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
    exitFullscreen();
  };

  const handleLeaveRoom = () => {
    peersRef.current.forEach((p) => p.destroy());
    peersRef.current.clear();
    socketRef.current?.disconnect();
    stream?.getTracks().forEach((t) => t.stop());
    navigate("/");
  };

  if (!roomId) return <div>Room not found</div>;

  const remoteVideosArray = Array.from(remoteVideos.entries());

  return (
    <div className={style.containerRoom}>
      <div
        ref={gridRef}
        id="video-grid-container"
        className={style.roomBox}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${layout.columns}, 0fr)`,
          gridTemplateRows: `repeat(${layout.rows}, 0fr)`,
          gap: "var(--room-box-gap-mobile)",
          width: "100%",
          placeItems: "center",
        }}
      >
        <div
          className={style.videoContainer}
          style={{
            width: videoSize.width,
            height: videoSize.height,
          }}
        >
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={style.roomParticipant}
          />
          <div className={style.videoLabel}>{userName || "Вы"}</div>
          <button
            className={style.fullscreenBtn}
            onClick={() => toggleFullscreen(localVideoRef.current?.parentElement || null, "local")}
            title={document.fullscreenElement && fullscreenTarget === "local" ? "Выйти" : "На весь экран"}
          >
            {document.fullscreenElement && fullscreenTarget === "local" ? (
              <img src={fullscreenOff} alt="fullscreen on" />
            ) : (
              <img src={fullscreenOn} alt="fullscreen on" />
            )}
          </button>
        </div>

        {remoteVideosArray.map(([id, remoteStream]) => (
          <div
            key={id}
            className={style.videoContainer}
            style={{
              width: videoSize.width,
              height: videoSize.height,
            }}
          >
            <video
              autoPlay
              playsInline
              className={style.roomParticipant}
              ref={(el) => {
                if (el) {
                  el.srcObject = remoteStream;
                  videoRefs.current.set(id, el);
                }
              }}
            />
            <div className={style.videoLabel}>
              {participants.get(id)?.userName || `User ${id.slice(0, 5)}`}
            </div>
            <button
              className={style.fullscreenBtn}
              onClick={() => toggleFullscreen(videoRefs.current.get(id)?.parentElement || null, id)}
              title={document.fullscreenElement && fullscreenTarget === id ? "Выйти" : "На весь экран"}
            >
              {document.fullscreenElement && fullscreenTarget === id ? (
                <img src={fullscreenOff} alt="fullscreen on" />
              ) : (
                <img src={fullscreenOn} alt="fullscreen on" />
              )}
            </button>
          </div>
        ))}
      </div>

      <RoomControlPanel
        stream={stream}
        onLeaveRoom={handleLeaveRoom}
        onToggleCamera={toggleCamera}
        isCameraOn={isCameraOn}
        onToggleScreenShare={toggleScreenShare}
        isScreenSharing={isScreenSharing}
        participantCount={participantCount}
      />

      <Chat
        socket={socket}
        roomId={roomId}
        userId={user?.id || null}
        userName={userName}
      />
    </div>
  );
}