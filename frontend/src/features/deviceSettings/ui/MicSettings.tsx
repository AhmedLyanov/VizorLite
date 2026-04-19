import { Switch, Slider } from "antd";
import { useDeviceStore } from "../../../entities/device/model/store";

export function MicSettings() {
  const {
    noiseSuppression,
    micVolume,
    setNoiseSuppression,
    setMicVolume,
  } = useDeviceStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Шумоподавление</span>
        <Switch
          checked={noiseSuppression}
          onChange={setNoiseSuppression}
        />
      </div>

      <div>
        <span>Громкость: {micVolume}</span>
        <Slider value={micVolume} onChange={setMicVolume} />
      </div>
    </div>
  );
}