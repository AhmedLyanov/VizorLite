import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface AppState {
  isBannerVisible: boolean;
  isMobileDevice: boolean;

  checkDeviceType: () => void;
  hideBanner: () => void;
  showBanner: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        isBannerVisible: true,
        isMobileDevice: false,

        checkDeviceType: () => {
          const userAgent = navigator.userAgent.toLowerCase();
          const isMobileUserAgent =
            /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
              userAgent
            );
          const isSmallScreen = window.innerWidth <= 768;

          set({ isMobileDevice: isMobileUserAgent || isSmallScreen });
        },

        hideBanner: () => {
          set({ isBannerVisible: false });
          localStorage.setItem("hideInstallApp", "true");
        },

        showBanner: () => {
          set({ isBannerVisible: true });
          localStorage.removeItem("hideInstallApp");
        },
      }),
      {
        name: "vizorlite",
      }
    )
  )
);