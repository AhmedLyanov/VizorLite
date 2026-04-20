import { useEffect, useRef } from "react";

interface Props {
  stream: MediaStream | null;
  enabled: boolean;
  threshold: number;
  delay: number;
  onMute: () => void;
  onUnmute: () => void;
}

export function useAutoMute({
  stream,
  enabled,
  threshold,
  delay,
  onMute,
  onUnmute,
}: Props) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const silenceStartRef = useRef<number | null>(null);
  const isMutedRef = useRef(false);

  useEffect(() => {
    if (!stream || !enabled) return;

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 512;
    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);

    let rafId: number;

    const checkVolume = () => {
      analyser.getByteTimeDomainData(data);

      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const val = (data[i] - 128) / 128;
        sum += val * val;
      }
      const rms = Math.sqrt(sum / data.length);

      const now = Date.now();

      if (rms < threshold) {
        if (!silenceStartRef.current) {
          silenceStartRef.current = now;
        }

        if (now - silenceStartRef.current > delay && !isMutedRef.current) {
          isMutedRef.current = true;
          onMute();
        }
      } else {
        silenceStartRef.current = null;

        if (isMutedRef.current) {
          isMutedRef.current = false;
          onUnmute();
        }
      }

      rafId = requestAnimationFrame(checkVolume);
    };

    checkVolume();

    return () => {
      cancelAnimationFrame(rafId);
      audioContext.close();
    };
  }, [stream, enabled, threshold, delay, onMute, onUnmute]);
}