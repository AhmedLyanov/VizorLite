import { useState } from "react";
import { Switch, Slider, Select, Radio } from "antd";
import styles from "./SharingSettings.module.css";

export function ShareSettings() {
  const [shareEnabled, setShareEnabled] = useState(false);
  const [shareAudio, setShareAudio] = useState(true);
  const [shareCursor, setShareCursor] = useState(true);
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium");
  const [frameRate, setFrameRate] = useState(30);
  const [resolution, setResolution] = useState<string>("1920x1080");
  const [bitrate, setBitrate] = useState(2500);
  const [captureDelay, setCaptureDelay] = useState(0);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span>Демонстрация экрана</span>
        <Switch checked={shareEnabled} onChange={setShareEnabled} />
      </div>

      <div className={styles.row}>
        <span>Захват звука системы</span>
        <Switch
          checked={shareAudio}
          onChange={setShareAudio}
          disabled={!shareEnabled}
        />
      </div>

      <div className={styles.row}>
        <span>Показывать курсор</span>
        <Switch
          checked={shareCursor}
          onChange={setShareCursor}
          disabled={!shareEnabled}
        />
      </div>

      <div>
        <span className={styles.sliderLabel}>Качество</span>
        <Radio.Group
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          disabled={!shareEnabled}
          className={styles.radioGroup}
        >
          <Radio value="low">Низкое (480p)</Radio>
          <Radio value="medium">Среднее (720p)</Radio>
          <Radio value="high">Высокое (1080p)</Radio>
        </Radio.Group>
      </div>

      <div className={styles.sliderContainer}>
        <span className={styles.sliderLabel}>
          Частота кадров (FPS): {frameRate}
        </span>
        <Slider
          min={5}
          max={60}
          step={1}
          value={frameRate}
          onChange={setFrameRate}
          disabled={!shareEnabled}
        />
      </div>

      <div>
        <span className={styles.sliderLabel}>Разрешение</span>
        <Select
          value={resolution}
          onChange={setResolution}
          disabled={!shareEnabled}
          className={styles.fullWidth}
          options={[
            { value: "1280x720", label: "1280x720 (HD)" },
            { value: "1920x1080", label: "1920x1080 (Full HD)" },
            { value: "2560x1440", label: "2560x1440 (2K)" },
            { value: "3840x2160", label: "3840x2160 (4K)" },
          ]}
        />
      </div>

      <div className={styles.sliderContainer}>
        <span className={styles.sliderLabel}>
          Битрейт (kbps): {bitrate}
        </span>
        <Slider
          min={500}
          max={10000}
          step={250}
          value={bitrate}
          onChange={setBitrate}
          disabled={!shareEnabled}
        />
      </div>

      <div className={styles.sliderContainer}>
        <span className={styles.sliderLabel}>
          Задержка захвата (мс): {captureDelay}
        </span>
        <Slider
          min={0}
          max={2000}
          step={100}
          value={captureDelay}
          onChange={setCaptureDelay}
          disabled={!shareEnabled}
        />
      </div>
    </div>
  );
}