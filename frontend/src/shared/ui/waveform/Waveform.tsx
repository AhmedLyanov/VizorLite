import { useEffect, useRef, useState } from "react";

type Props = {
  stream?: MediaStream;
};

export default function MicLevel({ stream }: Props) {
  const [volume, setVolume] = useState(0);
    
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let localStream: MediaStream | null = null;

    async function init() {
      try {
        localStream =
          stream || (await navigator.mediaDevices.getUserMedia({ audio: true }));

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(localStream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;

        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;

        const buffer = new ArrayBuffer(bufferLength);
        const dataArray: Uint8Array = new Uint8Array(buffer);

        function update() {
          if (!analyserRef.current) return;

analyser.getByteTimeDomainData(
  dataArray as unknown as Uint8Array<ArrayBuffer>
);

          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const value = (dataArray[i] - 128) / 128;
            sum += value * value;
          }

          const rms = Math.sqrt(sum / dataArray.length);
          setVolume(rms);

          animationRef.current = requestAnimationFrame(update);
        }

        update();
      } catch (err) {
        console.error("Mic error:", err);
      }
    }

    init();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (!stream && localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const width = Math.min(volume * 300, 100);

  return (
    <div style={wrapper}>
      <div
        style={{
          ...bar,
          width: `${width}%`,
        }}
      />
    </div>
  );
}

const wrapper: React.CSSProperties = {
  width: "140px",
  height: "6px",
  background: "#1e1e1e",
  borderRadius: "4px",
  overflow: "hidden",
};

const bar: React.CSSProperties = {
  height: "100%",
  background: "linear-gradient(90deg, #22c55e, #06b6d4)",
  transition: "width 0.05s linear",
};
