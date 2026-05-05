import { useEffect, useRef } from "react";
import { Hands } from "@mediapipe/hands";
import type { Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { Socket } from "socket.io-client";
import { useDeviceStore } from "../../entities/device/model/store";

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
  const throttleTimerRef = useRef<number | null>(null);
  const processingEnabledRef = useRef(false);
  const initializedRef = useRef(false);
  const isEraser = false;

  // Получаем текущие настройки из стора
  const { drawingColor, drawingSize } = useDeviceStore();

  // Рефы для динамических настроек (чтобы обновлялись без пересоздания MediaPipe)
  const drawingColorRef = useRef(drawingColor);
  const drawingSizeRef = useRef(drawingSize);

  // Синхронизация рефов с актуальными значениями из стора
  useEffect(() => {
    drawingColorRef.current = drawingColor;
  }, [drawingColor]);

  useEffect(() => {
    drawingSizeRef.current = drawingSize;
  }, [drawingSize]);

  // Обновление размеров canvas
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

  // Инициализация MediaPipe (один раз)
  useEffect(() => {
    if (!isLocal) return;
    if (initializedRef.current) return;
    if (!videoRef.current) return;

    const video = videoRef.current;
    initializedRef.current = true;

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
      if (!processingEnabledRef.current || !canvasRef.current || !skeletonCanvasRef.current) return;
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

        // Отрисовка скелета
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

        // Распознавание жеста
        const indexTip = points[8];
        const indexMcp = points[5];
        const middleTip = points[12];
        const middleMcp = points[9];
        const ringTip = points[16];
        const ringMcp = points[13];
        const pinkyTip = points[20];
        const pinkyMcp = points[17];

        const indexUp = indexTip.y < indexMcp.y;
        const middleDown = middleTip.y > middleMcp.y;
        const ringDown = ringTip.y > ringMcp.y;
        const pinkyDown = pinkyTip.y > pinkyMcp.y;

        const isDrawingGesture = indexUp && middleDown && ringDown && pinkyDown;

        if (isDrawingGesture && enabled) {
          const normX = mirrorHorizontally ? 1 - landmarks[8].x : landmarks[8].x;
          const normY = landmarks[8].y;
          const canvasX = normX * canvasRef.current.width;
          const canvasY = normY * canvasRef.current.height;

          if (isDrawingRef.current && lastPointRef.current) {
            // Используем текущие значения из рефов (а не из замыкания)
            const currentColor = drawingColorRef.current;
            const currentSize = drawingSizeRef.current;

            ctx.beginPath();
            ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
            ctx.lineTo(canvasX, canvasY);
            ctx.strokeStyle = isEraser ? "rgba(0,0,0,0)" : currentColor;
            ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";
            ctx.lineWidth = currentSize;
            ctx.stroke();

            if (!throttleTimerRef.current && socket) {
              socket.emit("draw-move", { roomId, userId, x: normX, y: normY });
              throttleTimerRef.current = window.setTimeout(() => {
                throttleTimerRef.current = null;
              }, 30);
            }
          } else {
            isDrawingRef.current = true;
            if (socket) {
              socket.emit("draw-start", {
                roomId,
                userId,
                x: normX,
                y: normY,
                color: drawingColorRef.current,
                size: drawingSizeRef.current,
                isEraser: false,
              });
            }
          }
          lastPointRef.current = { x: canvasX, y: canvasY };
        } else {
          if (isDrawingRef.current) {
            isDrawingRef.current = false;
            lastPointRef.current = null;
            if (socket) socket.emit("draw-end", { roomId, userId });
          }
        }
      } else {
        if (isDrawingRef.current) {
          isDrawingRef.current = false;
          lastPointRef.current = null;
          if (socket) socket.emit("draw-end", { roomId, userId });
        }
      }
    });

    const camera = new Camera(video, {
      onFrame: async () => {
        if (handsRef.current) {
          await hands.send({ image: video });
        }
      },
      width: 640,
      height: 480,
    });
    camera.start();

    handsRef.current = hands;
    cameraRef.current = camera;

    return () => {
      if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current);
      if (handsRef.current) {
        try {
          handsRef.current.close();
        } catch {
          console.warn("Hands close error");
        }
        handsRef.current = null;
      }
      if (cameraRef.current) {
        try {
          cameraRef.current.stop();
        } catch {
          console.warn("Camera stop error");
        }
        cameraRef.current = null;
      }
      initializedRef.current = false;
    };
  }, [isLocal, videoRef, mirrorHorizontally, roomId, userId, socket, enabled]);

  // Включение/выключение обработки жестов
  useEffect(() => {
    processingEnabledRef.current = enabled;
    if (!enabled) {
      isDrawingRef.current = false;
      lastPointRef.current = null;
      if (skeletonCanvasRef.current) {
        const skeletonCtx = skeletonCanvasRef.current.getContext("2d");
        skeletonCtx?.clearRect(0, 0, skeletonCanvasRef.current.width, skeletonCanvasRef.current.height);
      }
    }
  }, [enabled]);

  // Обработка удалённых событий
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