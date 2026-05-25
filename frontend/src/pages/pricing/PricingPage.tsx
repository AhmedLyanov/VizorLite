import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";

import { PRICING_TEXTS } from "@/shared/constants";
import { useAuth } from "@/entities/user/AuthContext";
import { stripeApi } from "@/shared/api/stripeApi";
import { HelpLink } from "@/shared/ui/helplink/HelpLink";
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

  const featureToGuideMap: Record<string, string> = {
    'pricing.pro.feature.chat': 'chat-messages',
    'pricing.pro.feature.ai': 'ai-features',
    'pricing.pro.feature.screen': 'screen-sharing',
    'pricing.pro.feature.background': 'background-effects',
    'pricing.pro.feature.devices': 'device-settings',
    'pricing.pro.feature.security': 'security',
    'pricing.pro.feature.localization': 'localization',
    'pricing.pro.feature.mobile': 'mobile-app',
  };

  const freeFeatures = [
    { id: "pricing.free.feature1", guideId: "getting-started" },
    { id: "pricing.free.feature2", guideId: "creating-room" },
    { id: "pricing.free.feature3", guideId: "join-room" },
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
              <span className={styles.price}>
                {intl.formatMessage({ id: PRICING_TEXTS.PLANS.BASIC.PRICE })}
              </span>
            </div>
          </div>
          <div className={styles.featuresList}>
            {freeFeatures.map((feature, index) => (
              <div key={index} className={styles.featureItem}>
                <div className={styles.featureTextWrapper}>
                  <img src={checkIcon} alt="" className={styles.featureIcon} />
                  <span className={styles.featureText}>
                    {intl.formatMessage({ id: feature.id })}
                  </span>
                  <HelpLink 
                    guideSectionId={feature.guideId}
                    iconSize={14}
                    tooltipText={intl.formatMessage({ id: "pricing.learnMore" })}
                  />
                </div>
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
            {PRICING_TEXTS.PLANS.BUSINESS.FEATURES.map((feature, index) => {
              const guideId = featureToGuideMap[feature] || 'pro-features';
              return (
                <div key={index} className={styles.featureItem}>
                  <div className={styles.featureTextWrapper}>
                    <img src={checkIcon} alt="" className={styles.featureIcon} />
                    <span className={styles.featureText}>
                      {intl.formatMessage({ id: feature })}
                    </span>
                    <HelpLink 
                      guideSectionId={guideId}
                      iconSize={14}
                      tooltipText={intl.formatMessage({ id: "pricing.learnMore" })}
                    />
                  </div>
                </div>
              );
            })}
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