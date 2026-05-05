import { Switch} from "antd";

import { useDeviceStore } from "@/entities/device";

import styles from "./CameraSettings.module.css";

export function CameraSettings() {
  const {
    cameraEnabled,
    setCameraEnabled,
    fingerDrawingEnabled,
    setFingerDrawingEnabled,
  } = useDeviceStore();
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span>Включить камеру</span>
        <Switch checked={cameraEnabled} onChange={setCameraEnabled} />
      </div>

      <div className={styles.row}>
        <span>Рисование пальцем</span>
        <Switch checked={fingerDrawingEnabled} onChange={setFingerDrawingEnabled} />
      </div>

    </div>
  );
}