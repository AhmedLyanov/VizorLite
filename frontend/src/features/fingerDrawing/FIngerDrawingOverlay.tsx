import { useEffect, useRef } from "react";
import { Hands } from "@mediapipe/hands";
import type { Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { Socket } from "socket.io-client";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  socket: Socket | null;
  roomId: string;
  userId: string;
  isLocal: boolean;
  enabled: boolean;
  mirrorHorizontally?: boolean;
}

export function FingerDrawingOverlay({
  videoRef,
  socket,
  roomId,
  userId,
  isLocal,
  enabled,
  mirrorHorizontally = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const brushColorRef = useRef("#000000");
  const brushSizeRef = useRef(5);
  const isEraserRef = useRef(false);
  const stickerJustPlacedRef = useRef(false);
  const throttleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return;
    const updateCanvasSize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [videoRef]);

  useEffect(() => {
    if (!isLocal || !enabled || !videoRef.current) {
      if (handsRef.current) {
        handsRef.current.close();
        handsRef.current = null;
      }
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results: Results) => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const indexTip = { x: mirrorHorizontally ? 1 - landmarks[8].x : landmarks[8].x, y: landmarks[8].y };
        const indexMCP = { x: mirrorHorizontally ? 1 - landmarks[5].x : landmarks[5].x, y: landmarks[5].y };
        const middleTip = { x: mirrorHorizontally ? 1 - landmarks[12].x : landmarks[12].x, y: landmarks[12].y };
        const middleMCP = { x: mirrorHorizontally ? 1 - landmarks[9].x : landmarks[9].x, y: landmarks[9].y };
        const ringTip = { x: mirrorHorizontally ? 1 - landmarks[16].x : landmarks[16].x, y: landmarks[16].y };
        const ringMCP = { x: mirrorHorizontally ? 1 - landmarks[13].x : landmarks[13].x, y: landmarks[13].y };
        const pinkyTip = { x: mirrorHorizontally ? 1 - landmarks[20].x : landmarks[20].x, y: landmarks[20].y };
        const pinkyMCP = { x: mirrorHorizontally ? 1 - landmarks[17].x : landmarks[17].x, y: landmarks[17].y };

        const isIndexExtended = indexTip.y < indexMCP.y;
        const isMiddleBent = middleTip.y > middleMCP.y;
        const isRingBent = ringTip.y > ringMCP.y;
        const isPinkyBent = pinkyTip.y > pinkyMCP.y;
        const isMiddleExtended = middleTip.y < middleMCP.y;

        const isPencilGesture = isIndexExtended && isMiddleBent && isRingBent && isPinkyBent;
        const isVGesture = isIndexExtended && isMiddleExtended && isRingBent && isPinkyBent;

        if (isPencilGesture) {
          const canvasX = indexTip.x * canvasRef.current.width;
          const canvasY = indexTip.y * canvasRef.current.height;
          if (isDrawingRef.current && lastPointRef.current) {
            if (!throttleTimerRef.current) {
              ctx.beginPath();
              ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
              ctx.lineTo(canvasX, canvasY);
              ctx.strokeStyle = isEraserRef.current ? "rgba(0,0,0,0)" : brushColorRef.current;
              ctx.globalCompositeOperation = isEraserRef.current ? "destination-out" : "source-over";
              ctx.lineWidth = brushSizeRef.current;
              ctx.stroke();

              socket?.emit("draw-move", { roomId, userId, x: canvasX, y: canvasY });
              throttleTimerRef.current = window.setTimeout(() => {
                throttleTimerRef.current = null;
              }, 30);
            }
          } else {
            isDrawingRef.current = true;
            socket?.emit("draw-start", {
              roomId,
              userId,
              x: canvasX,
              y: canvasY,
              color: brushColorRef.current,
              size: brushSizeRef.current,
              isEraser: isEraserRef.current,
            });
          }
          lastPointRef.current = { x: canvasX, y: canvasY };
        } else if (isVGesture && !stickerJustPlacedRef.current) {
          const canvasX = indexTip.x * canvasRef.current.width;
          const canvasY = indexTip.y * canvasRef.current.height;
          stickerJustPlacedRef.current = true;
          setTimeout(() => (stickerJustPlacedRef.current = false), 800);
          socket?.emit("draw-sticker", { roomId, userId, stickerId: "star", x: canvasX, y: canvasY });
        } else {
          if (isDrawingRef.current) {
            isDrawingRef.current = false;
            lastPointRef.current = null;
            socket?.emit("draw-end", { roomId, userId });
          }
        }
      } else {
        if (isDrawingRef.current) {
          isDrawingRef.current = false;
          lastPointRef.current = null;
          socket?.emit("draw-end", { roomId, userId });
        }
      }
    });

    const camera = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    handsRef.current = hands;
    cameraRef.current = camera;

    return () => {
      camera.stop();
      hands.close();
      if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current);
    };
  }, [isLocal, enabled, videoRef, socket, roomId, userId, mirrorHorizontally]);

  useEffect(() => {
    if (isLocal || !socket) return;

    const onDrawStart = (data: { userId: string; x: number; y: number; color: string; size: number; isEraser: boolean }) => {
      if (data.userId === userId) return;
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
      ctx.strokeStyle = data.isEraser ? "rgba(0,0,0,0)" : data.color;
      ctx.globalCompositeOperation = data.isEraser ? "destination-out" : "source-over";
      ctx.lineWidth = data.size;
      ctx.stroke();
      lastPointRef.current = { x: data.x, y: data.y };
      isDrawingRef.current = true;
    };

    const onDrawMove = (data: { userId: string; x: number; y: number }) => {
      if (data.userId === userId) return;
      if (!canvasRef.current || !isDrawingRef.current || !lastPointRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
      lastPointRef.current = { x: data.x, y: data.y };
    };

    const onDrawEnd = (data: { userId: string }) => {
      if (data.userId === userId) return;
      isDrawingRef.current = false;
      lastPointRef.current = null;
    };

    const onDrawSticker = (data: { userId: string; stickerId: string; x: number; y: number }) => {
      if (data.userId === userId) return;
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      ctx.font = "48px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      ctx.fillText("⭐", data.x, data.y);
    };

    const onDrawClear = (data: { userId: string }) => {
      if (data.userId === userId) return;
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    socket.on("draw-start", onDrawStart);
    socket.on("draw-move", onDrawMove);
    socket.on("draw-end", onDrawEnd);
    socket.on("draw-sticker", onDrawSticker);
    socket.on("draw-clear", onDrawClear);

    return () => {
      socket.off("draw-start", onDrawStart);
      socket.off("draw-move", onDrawMove);
      socket.off("draw-end", onDrawEnd);
      socket.off("draw-sticker", onDrawSticker);
      socket.off("draw-clear", onDrawClear);
    };
  }, [socket, isLocal, userId]);

  return (
    <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}