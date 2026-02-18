import { useEffect, useRef, useState } from "react";
import { Icon } from "../../assets/icons/Icon";

interface MicLevelVisualizerProps {
  stream: MediaStream | null;
}

export default function MicLevelVisualizer({ stream }: MicLevelVisualizerProps) {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!stream) return;

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) return;

    if (!audioTracks[0].enabled) {
      setIsSpeaking(false);
      return;
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContextClass();
    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    sourceRef.current = source;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const detectSound = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      setAudioLevel(average);
      setIsSpeaking(average > 10);

      animationFrameRef.current = requestAnimationFrame(detectSound);
    };

    detectSound();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (sourceRef.current) sourceRef.current.disconnect();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [stream]);

  const activeColor = "#10B981";
  const inactiveColor = "#9CA3AF";
  const currentColor = isSpeaking ? activeColor : inactiveColor;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "24px",
        height: "24px",
      }}
      title={`Audio Level: ${audioLevel.toFixed(2)}`}
    >
      <Icon
        name="micLevel"
        fill={currentColor}
        size={24}
      />
    </div>
  );
}