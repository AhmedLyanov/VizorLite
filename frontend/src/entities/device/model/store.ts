import { create } from "zustand";

type DeviceState = {
  micEnabled: boolean;
  cameraEnabled: boolean;
  screenEnabled: boolean;

  micVolume: number;
  noiseSuppression: boolean;

  cameraBrightness: number; 

  setMicEnabled: (v: boolean) => void;
  setCameraEnabled: (v: boolean) => void;
  setScreenEnabled: (v: boolean) => void;

  setMicVolume: (v: number) => void;
  setNoiseSuppression: (v: boolean) => void;
  setCameraBrightness: (v: number) => void; 
};

export const useDeviceStore = create<DeviceState>((set) => ({
  micEnabled: true,
  cameraEnabled: true,
  screenEnabled: false,

  micVolume: 70,
  noiseSuppression: true,

  cameraBrightness: 50, 

  setMicEnabled: (v) => set({ micEnabled: v }),
  setCameraEnabled: (v) => set({ cameraEnabled: v }),
  setScreenEnabled: (v) => set({ screenEnabled: v }),

  setMicVolume: (v) => set({ micVolume: v }),
  setNoiseSuppression: (v) => set({ noiseSuppression: v }),
  setCameraBrightness: (v) => set({ cameraBrightness: v }),
}));