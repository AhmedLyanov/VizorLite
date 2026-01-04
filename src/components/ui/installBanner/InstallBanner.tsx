import { useState, useEffect } from "react";
import { useIntl } from "react-intl";

import styles from "./installBanner.module.css";
import { HOME_TEXTS } from "../../../constants";

export default function InstallBanner() {
  const intl = useIntl();

  const [isVisible, setIsVisible] = useState(true);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkDeviceSize = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUserAgent =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        );
      const isSmallScreen = window.innerWidth <= 768;

      setIsMobileDevice(isMobileUserAgent || isSmallScreen);
    };

    const wasBannerClosed = localStorage.getItem(
      "vizorlite_install_banner_closed"
    );
    if (wasBannerClosed === "true") {
      setIsVisible(false);
    }

    checkDeviceSize();
    window.addEventListener("resize", checkDeviceSize);

    return () => {
      window.removeEventListener("resize", checkDeviceSize);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("vizorlite_install_banner_closed", "true");
  };

  if (!isMobileDevice || !isVisible) {
    return null;
  }

  return (
    <div className={styles.banner}>
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
          <button className={styles.installButton}>
            {intl.formatMessage({
              id: HOME_TEXTS.INSTALL_BANNER.INSTALL_BUTTON,
            })}
          </button>

          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close banner"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
