import { Switch, Slider } from "antd";
import { useDeviceStore } from "../../../entities/device/model/store";

export function MicSettings() {
  const {
    autoMute,
    autoMuteThreshold,
    autoMuteDelay,
    setAutoMute,
    setAutoMuteThreshold,
    setAutoMuteDelay,
  } = useDeviceStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Включить автомут</span>
        <Switch checked={autoMute} onChange={setAutoMute} />
      </div>

      <div>
        <span>Чувствительность: {autoMuteThreshold.toFixed(2)}</span>
        <Slider
          min={0.005}
          max={0.1}
          step={0.005}
          value={autoMuteThreshold}
          onChange={setAutoMuteThreshold}
        />
      </div>

      <div>
        <span>Задержка (мс): {autoMuteDelay}</span>
        <Slider
          min={500}
          max={5000}
          step={500}
          value={autoMuteDelay}
          onChange={setAutoMuteDelay}
        />
      </div>
    </div>
  );
}