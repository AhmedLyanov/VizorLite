import { Switch} from "antd";

import { useDeviceStore } from "@/entities/device";

import styles from "./CameraSettings.module.css";

export function CameraSettings() {
  const {
    cameraEnabled,
    setCameraEnabled,
  } = useDeviceStore();
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span>Включить камеру</span>
        <Switch checked={cameraEnabled} onChange={setCameraEnabled} />
      </div>
    </div>
  );
}