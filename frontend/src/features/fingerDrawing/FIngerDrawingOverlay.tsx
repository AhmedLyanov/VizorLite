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
  mirrorHorizontally = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skeletonCanvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const brushColorRef = useRef("#000000");
  const brushSizeRef = useRef(5);
  const isEraserRef = useRef(false);
  const throttleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateCanvasSize = () => {
      if (!containerRef.current || !canvasRef.current || !skeletonCanvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
      skeletonCanvasRef.current.width = rect.width;
      skeletonCanvasRef.current.height = rect.height;
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

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
      if (!canvasRef.current || !skeletonCanvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      const skeletonCtx = skeletonCanvasRef.current.getContext("2d");
      if (!ctx || !skeletonCtx) return;

      skeletonCtx.clearRect(0, 0, skeletonCanvasRef.current.width, skeletonCanvasRef.current.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const points = landmarks.map(lm => {
          const x = mirrorHorizontally ? 1 - lm.x : lm.x;
          const y = lm.y;
          return {
            x: x * skeletonCanvasRef.current!.width,
            y: y * skeletonCanvasRef.current!.height,
          };
        });

        const connections = [
          [0,1], [1,2], [2,3], [3,4], [0,5], [5,6], [6,7], [7,8],
          [0,9], [9,10], [10,11], [11,12], [0,13], [13,14], [14,15], [15,16],
          [0,17], [17,18], [18,19], [19,20], [5,9], [9,13], [13,17]
        ];
        skeletonCtx.beginPath();
        skeletonCtx.strokeStyle = "#00ff00";
        skeletonCtx.lineWidth = 2;
        for (const [start, end] of connections) {
          const p1 = points[start];
          const p2 = points[end];
          if (p1 && p2) {
            skeletonCtx.beginPath();
            skeletonCtx.moveTo(p1.x, p1.y);
            skeletonCtx.lineTo(p2.x, p2.y);
            skeletonCtx.stroke();
          }
        }
        for (const p of points) {
          skeletonCtx.beginPath();
          skeletonCtx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
          skeletonCtx.fillStyle = "#00ff00";
          skeletonCtx.fill();
        }

        const indexTip = points[8];
        const indexMCP = points[5];
        const middleTip = points[12];
        const middleMCP = points[9];
        const ringTip = points[16];
        const ringMCP = points[13];
        const pinkyTip = points[20];
        const pinkyMCP = points[17];

        const isIndexExtended = indexTip.y < indexMCP.y;
        const isMiddleBent = middleTip.y > middleMCP.y;
        const isRingBent = ringTip.y > ringMCP.y;
        const isPinkyBent = pinkyTip.y > pinkyMCP.y;

        const isDrawingGesture = isIndexExtended && isMiddleBent && isRingBent && isPinkyBent;

        if (isDrawingGesture) {
          const normX = mirrorHorizontally ? 1 - landmarks[8].x : landmarks[8].x;
          const normY = landmarks[8].y;
          const canvasX = normX * canvasRef.current.width;
          const canvasY = normY * canvasRef.current.height;

          if (isDrawingRef.current && lastPointRef.current) {
            ctx.beginPath();
            ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
            ctx.lineTo(canvasX, canvasY);
            ctx.strokeStyle = isEraserRef.current ? "rgba(0,0,0,0)" : brushColorRef.current;
            ctx.globalCompositeOperation = isEraserRef.current ? "destination-out" : "source-over";
            ctx.lineWidth = brushSizeRef.current;
            ctx.stroke();

            if (!throttleTimerRef.current) {
              socket?.emit("draw-move", { roomId, userId, x: normX, y: normY });
              throttleTimerRef.current = window.setTimeout(() => {
                throttleTimerRef.current = null;
              }, 30);
            }
          } else {
            isDrawingRef.current = true;
            socket?.emit("draw-start", {
              roomId,
              userId,
              x: normX,
              y: normY,
              color: brushColorRef.current,
              size: brushSizeRef.current,
              isEraser: isEraserRef.current,
            });
          }
          lastPointRef.current = { x: canvasX, y: canvasY };
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
      if (data.userId !== userId) return;
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      const canvasX = data.x * canvasRef.current.width;
      const canvasY = data.y * canvasRef.current.height;
      ctx.beginPath();
      ctx.moveTo(canvasX, canvasY);
      ctx.strokeStyle = data.isEraser ? "rgba(0,0,0,0)" : data.color;
      ctx.globalCompositeOperation = data.isEraser ? "destination-out" : "source-over";
      ctx.lineWidth = data.size;
      ctx.stroke();
      lastPointRef.current = { x: canvasX, y: canvasY };
      isDrawingRef.current = true;
    };

    const onDrawMove = (data: { userId: string; x: number; y: number }) => {
      if (data.userId !== userId) return;
      if (!canvasRef.current || !isDrawingRef.current || !lastPointRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      const canvasX = data.x * canvasRef.current.width;
      const canvasY = data.y * canvasRef.current.height;
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(canvasX, canvasY);
      ctx.stroke();
      lastPointRef.current = { x: canvasX, y: canvasY };
    };

    const onDrawEnd = (data: { userId: string }) => {
      if (data.userId !== userId) return;
      isDrawingRef.current = false;
      lastPointRef.current = null;
    };

    const onDrawClear = (data: { userId: string }) => {
      if (data.userId !== userId) return;
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    socket.on("draw-start", onDrawStart);
    socket.on("draw-move", onDrawMove);
    socket.on("draw-end", onDrawEnd);
    socket.on("draw-clear", onDrawClear);

    return () => {
      socket.off("draw-start", onDrawStart);
      socket.off("draw-move", onDrawMove);
      socket.off("draw-end", onDrawEnd);
      socket.off("draw-clear", onDrawClear);
    };
  }, [socket, isLocal, userId]);

  return (
    <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      {isLocal && (
        <canvas
          ref={skeletonCanvasRef}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "block", pointerEvents: "none" }}
        />
      )}
    </div>
  );
}