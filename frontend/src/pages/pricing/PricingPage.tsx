import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";

import { PRICING_TEXTS } from "@/shared/constants";
import { useAuth } from "@/entities/user/AuthContext";
import { stripeApi } from "@/shared/api/stripeApi";
import checkIcon from "@/shared/assets/check-mark.svg";

import styles from "./Pricing.module.css";

export default function PricingPage() {
  const intl = useIntl();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSelectPro = async () => {
    if (!isAuthenticated) {
      navigate("/auth?redirect=/pricing");
      return;
    }

    try {
      const response = await stripeApi.createCheckout();
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      alert(intl.formatMessage({ id: "pricing.error.checkout" }));
    }
  };

  const freeFeatures = [
    "pricing.free.feature1",
    "pricing.free.feature2",
    "pricing.free.feature3",
  ];

  return (
    <div className={styles.pricingPage}>
      <div className={styles.heroSection}>
        <h1 className={styles.mainTitle}>
          {intl.formatMessage({ id: PRICING_TEXTS.TITLE })}
        </h1>
      </div>

      <div className={styles.pricingCardsWrapper}>
        <div className={styles.pricingCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.planName}>
              {intl.formatMessage({ id: "pricing.plans.free.name" })}
            </h3>
            <div className={styles.priceContainer}>
              <span className={styles.price}>0₽</span>
            </div>
          </div>
          <div className={styles.featuresList}>
            {freeFeatures.map((feature, index) => (
              <div key={index} className={styles.featureItem}>
                <img src={checkIcon} alt="" className={styles.featureIcon} />
                <span className={styles.featureText}>
                  {intl.formatMessage({ id: feature })}
                </span>
              </div>
            ))}
          </div>
          <button className={styles.activeButton} disabled>
            <img src={checkIcon} alt="" className={styles.activeIcon} />
          </button>
        </div>

        <div className={`${styles.pricingCard} ${styles.proCard}`}>
          <div className={styles.cardBadge}>
            <span>{intl.formatMessage({ id: "pricing.bestValue" })}</span>
          </div>
          <div className={styles.cardHeader}>
            <h3 className={styles.planName}>
              {intl.formatMessage({ id: "pricing.plans.pro.name" })}
            </h3>
            <div className={styles.priceContainer}>
              <span className={styles.price}>
                {intl.formatMessage({ id: PRICING_TEXTS.PLANS.BUSINESS.PRICE })}
              </span>
              <span className={styles.period}>
                {intl.formatMessage({ id: PRICING_TEXTS.PLANS.BUSINESS.PERIOD })}
              </span>
            </div>
          </div>
          <div className={styles.featuresList}>
            {PRICING_TEXTS.PLANS.BUSINESS.FEATURES.map((feature, index) => (
              <div key={index} className={styles.featureItem}>
                <img src={checkIcon} alt="" className={styles.featureIcon} />
                <span className={styles.featureText}>
                  {intl.formatMessage({ id: feature })}
                </span>
              </div>
            ))}
          </div>
          <button
            className={`${styles.selectButton} ${styles.proButton}`}
            onClick={handleSelectPro}
          >
            {intl.formatMessage({ id: PRICING_TEXTS.SELECT_BUTTON })}
          </button>
        </div>
      </div>
    </div>
  );
}