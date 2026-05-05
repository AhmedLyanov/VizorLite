import { useEffect } from "react";
import { useIntl } from "react-intl";

import { HOME_TEXTS } from "@/shared/constants";
import { useAppStore } from "@/entities/device/useAppStore";

import styles from "./installBanner.module.css";

export default function InstallBanner() {
  const intl = useIntl();

  const { isBannerVisible, isMobileDevice, checkDeviceType, hideBanner } =
    useAppStore();

  useEffect(() => {
    const wasBannerClosed = localStorage.getItem(
      "hideInstallApp"
    );

    if (wasBannerClosed === "true") {
      hideBanner();
    }

    checkDeviceType();

    const handleResize = () => {
      checkDeviceType();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [checkDeviceType, hideBanner]);

  const handleInstallClick = () => {
    hideBanner();
  };

  if (!isMobileDevice || !isBannerVisible) {
    return null;
  }

  return (
    <div
      className={styles.banner}
      role="banner"
      aria-label="Installation banner"
    >
      <div className={styles.content}>
        <div className={styles.text}>
          <h3 className={styles.title}>
            {intl.formatMessage({
              id: HOME_TEXTS.INSTALL_BANNER.TITLE,
            })}
          </h3>

          <p className={styles.description}>
            {intl.formatMessage({
              id: HOME_TEXTS.INSTALL_BANNER.DESCRIPTION,
            })}
          </p>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.installButton}
            onClick={handleInstallClick}
            aria-label={intl.formatMessage({
              id: HOME_TEXTS.INSTALL_BANNER.INSTALL_BUTTON,
            })}
          >
            {intl.formatMessage({
              id: HOME_TEXTS.INSTALL_BANNER.INSTALL_BUTTON,
            })}
          </button>

          <button
            className={styles.closeButton}
            onClick={hideBanner}
            aria-label="Close installation banner"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
