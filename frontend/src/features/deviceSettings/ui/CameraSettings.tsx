import { Switch, Slider } from "antd";
import { useDeviceStore } from "../../../entities/device/model/store";

export function CameraSettings() {
  const {
    cameraEnabled,    
    cameraBrightness, 
    setCameraEnabled,
    setCameraBrightness,
  } = useDeviceStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Включить камеру</span>
        <Switch
          checked={cameraEnabled}
          onChange={setCameraEnabled}
        />
      </div>

      <div>
        <span>Яркость: {cameraBrightness}</span>
        <Slider
          value={cameraBrightness}
          onChange={setCameraBrightness}
          min={0}
          max={100}
        />
      </div>
    </div>
  );
}