import { useState } from "react";
import { Switch, Slider, Select } from "antd";
import { useDeviceStore } from "../../../../entities/device/model/store";
import styles from "./CameraSettings.module.css";

export function CameraSettings() {
  const {
    cameraEnabled,
    cameraBrightness,
    setCameraEnabled,
    setCameraBrightness,
  } = useDeviceStore();

  const [contrast, setContrast] = useState(50);
  const [saturation, setSaturation] = useState(50);
  const [whiteBalance, setWhiteBalance] = useState<string>("auto");
  const [resolution, setResolution] = useState<string>("1920x1080");
  const [mirror, setMirror] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span>Включить камеру</span>
        <Switch checked={cameraEnabled} onChange={setCameraEnabled} />
      </div>

      <div className={styles.sliderContainer}>
        <span className={styles.sliderLabel}>Яркость: {cameraBrightness}</span>
        <Slider
          value={cameraBrightness}
          onChange={setCameraBrightness}
          min={0}
          max={100}
        />
      </div>

      <div className={styles.sliderContainer}>
        <span className={styles.sliderLabel}>Контрастность: {contrast}</span>
        <Slider
          value={contrast}
          onChange={setContrast}
          min={0}
          max={100}
        />
      </div>

      <div className={styles.sliderContainer}>
        <span className={styles.sliderLabel}>Насыщенность: {saturation}</span>
        <Slider
          value={saturation}
          onChange={setSaturation}
          min={0}
          max={100}
        />
      </div>

      <div>
        <span className={styles.sliderLabel}>Баланс белого</span>
        <Select
          value={whiteBalance}
          onChange={setWhiteBalance}
          className={styles.fullWidth}
          options={[
            { value: "auto", label: "Авто" },
            { value: "daylight", label: "Дневной свет" },
            { value: "cloudy", label: "Облачно" },
            { value: "tungsten", label: "Лампа накаливания" },
            { value: "fluorescent", label: "Люминесцентная" },
          ]}
        />
      </div>

      <div>
        <span className={styles.sliderLabel}>Разрешение</span>
        <Select
          value={resolution}
          onChange={setResolution}
          className={styles.fullWidth}
          options={[
            { value: "640x480", label: "640x480 (VGA)" },
            { value: "1280x720", label: "1280x720 (HD)" },
            { value: "1920x1080", label: "1920x1080 (Full HD)" },
            { value: "3840x2160", label: "3840x2160 (4K)" },
          ]}
        />
      </div>

      <div className={styles.row}>
        <span>Зеркальное отображение</span>
        <Switch checked={mirror} onChange={setMirror} />
      </div>
    </div>
  );
}