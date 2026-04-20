import { useState } from "react";
import { Switch, Slider, Select } from "antd";
import { useDeviceStore } from "../../../../entities/device/model/store";
import styles from "./MicSettings.module.css";

export function MicSettings() {
  const {
    autoMute,
    autoMuteThreshold,
    autoMuteDelay,
    setAutoMute,
    setAutoMuteThreshold,
    setAutoMuteDelay,
  } = useDeviceStore();

  const [noiseSuppression, setNoiseSuppression] = useState(false);
  const [gain, setGain] = useState(0);
  const [echoCancellation, setEchoCancellation] = useState(true);
  const [sampleRate, setSampleRate] = useState<number>(48000);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span>Включить автомут</span>
        <Switch checked={autoMute} onChange={setAutoMute} />
      </div>

      <div className={styles.sliderContainer}>
        <span className={styles.sliderLabel}>
          Чувствительность: {autoMuteThreshold.toFixed(3)}
        </span>
        <Slider
          min={0.005}
          max={0.1}
          step={0.005}
          value={autoMuteThreshold}
          onChange={setAutoMuteThreshold}
        />
      </div>

      <div className={styles.sliderContainer}>
        <span className={styles.sliderLabel}>
          Задержка (мс): {autoMuteDelay}
        </span>
        <Slider
          min={500}
          max={5000}
          step={500}
          value={autoMuteDelay}
          onChange={setAutoMuteDelay}
        />
      </div>

      <div className={styles.row}>
        <span>Подавление шума (NR)</span>
        <Switch checked={noiseSuppression} onChange={setNoiseSuppression} />
      </div>

      <div className={styles.sliderContainer}>
        <span className={styles.sliderLabel}>
          Усиление микрофона (dB): {gain}
        </span>
        <Slider
          min={-20}
          max={20}
          step={1}
          value={gain}
          onChange={setGain}
        />
      </div>

      <div className={styles.row}>
        <span>Эхоподавление (AEC)</span>
        <Switch checked={echoCancellation} onChange={setEchoCancellation} />
      </div>

      <div>
        <span className={styles.sliderLabel}>Частота дискретизации (Гц)</span>
        <Select
          value={sampleRate}
          onChange={setSampleRate}
          className={styles.fullWidth}
          options={[
            { value: 16000, label: "16 кГц" },
            { value: 44100, label: "44.1 кГц" },
            { value: 48000, label: "48 кГц" },
            { value: 96000, label: "96 кГц" },
          ]}
        />
      </div>
    </div>
  );
}