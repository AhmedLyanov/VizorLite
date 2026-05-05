import { Link, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";

import { PRICING_TEXTS } from "@/shared/constants";
import { useAuth } from "@/entities/user/AuthContext";
import { stripeApi } from "@/shared/api/stripeApi";
import questionIcon from "@/shared/assets/question.svg";

import styles from "./Pricing.module.css";

export default function PricingPage() {
  const intl = useIntl();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSelectPlan = async () => {
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
      console.error("Checkout error:", error);
      alert(intl.formatMessage({ id: "pricing.error.checkout" }));
    }
  };

  return (
    <section className={styles.sectionContent}>
      <div className={styles.contentContainer}>
        <h1 className={styles.mainTitle}>
          {intl.formatMessage({ id: PRICING_TEXTS.TITLE })}
        </h1>
        <p className={styles.subtitle}>
          {intl.formatMessage({ id: PRICING_TEXTS.SUBTITLE })}
        </p>

        <div className={styles.pricingCards}>
          <div className={styles.pricingCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.planName}>
                {intl.formatMessage({ id: PRICING_TEXTS.PLANS.BASIC.NAME })}
              </h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>
                  {intl.formatMessage({ id: PRICING_TEXTS.PLANS.BASIC.PRICE })}
                </span>
                <span className={styles.period}>
                  {intl.formatMessage({ id: PRICING_TEXTS.PLANS.BASIC.PERIOD })}
                </span>
              </div>
            </div>

            <div className={styles.featuresList}>
              {PRICING_TEXTS.PLANS.BASIC.FEATURES.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <img
                    src="/images/check.svg"
                    alt=""
                    className={styles.featureIcon}
                  />
                  <span className={styles.featureText}>
                    {intl.formatMessage({ id: feature })}
                  </span>
                </div>
              ))}
            </div>

            <button className={styles.selectButton}>
              {intl.formatMessage({ id: PRICING_TEXTS.SELECT_BUTTON })}
            </button>
          </div>

          <div className={`${styles.pricingCard} ${styles.recommended}`}>
            <div className={styles.recommendedBadge}>
              {intl.formatMessage({ id: PRICING_TEXTS.RECOMMENDED })}
            </div>
            <div className={styles.cardHeader}>
              <h3 className={styles.planName}>
                {intl.formatMessage({ id: PRICING_TEXTS.PLANS.BUSINESS.NAME })}
              </h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>
                  {intl.formatMessage({
                    id: PRICING_TEXTS.PLANS.BUSINESS.PRICE,
                  })}
                </span>
                <span className={styles.period}>
                  {intl.formatMessage({
                    id: PRICING_TEXTS.PLANS.BUSINESS.PERIOD,
                  })}
                </span>
              </div>
            </div>

            <div className={styles.featuresList}>
              {PRICING_TEXTS.PLANS.BUSINESS.FEATURES.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <img
                    src="/images/check.svg"
                    alt=""
                    className={styles.featureIcon}
                  />
                  <span className={styles.featureText}>
                    {intl.formatMessage({ id: feature })}
                  </span>
                </div>
              ))}
            </div>

            <button
              className={`${styles.selectButton} ${styles.recommendedButton}`}
              onClick={handleSelectPlan}
            >
              {intl.formatMessage({ id: PRICING_TEXTS.SELECT_BUTTON })}
            </button>
          </div>

          <div className={styles.pricingCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.planName}>
                {intl.formatMessage({ id: PRICING_TEXTS.PLANS.PREMIUM.NAME })}
              </h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>
                  {intl.formatMessage({
                    id: PRICING_TEXTS.PLANS.PREMIUM.PRICE,
                  })}
                </span>
                <span className={styles.period}>
                  {intl.formatMessage({
                    id: PRICING_TEXTS.PLANS.PREMIUM.PERIOD,
                  })}
                </span>
              </div>
            </div>

            <div className={styles.featuresList}>
              {PRICING_TEXTS.PLANS.PREMIUM.FEATURES.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <img
                    src="/images/check.svg"
                    alt=""
                    className={styles.featureIcon}
                  />
                  <span className={styles.featureText}>
                    {intl.formatMessage({ id: feature })}
                  </span>
                </div>
              ))}
            </div>

            <button className={styles.selectButton}>
              {intl.formatMessage({ id: PRICING_TEXTS.SELECT_BUTTON })}
            </button>
          </div>
        </div>

        <div className={styles.faqSection}>
          <h2 className={styles.faqTitle}>
            {intl.formatMessage({ id: PRICING_TEXTS.FAQ.TITLE })}
          </h2>
          <div className={styles.faqList}>
            {PRICING_TEXTS.FAQ.ITEMS.map((item, index) => (
              <div key={index} className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>
                  {intl.formatMessage({ id: item.question })}
                </h4>
                <p className={styles.faqAnswer}>
                  {intl.formatMessage({ id: item.answer })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.bottomContent}>
        <div className={styles.bottomLinks}>
          <Link to="/" className={styles.bottomLink}>
            <img
              src="/images/home.svg"
              alt={intl.formatMessage({ id: "nav.home" })}
              className={styles.linkIcon}
            />
            <span>{intl.formatMessage({ id: "nav.home" })}</span>
          </Link>
          <Link to="/about" className={styles.bottomLink}>
            <img
              src={questionIcon}
              alt={intl.formatMessage({ id: "nav.about" })}
              className={styles.linkIcon}
            />
            <span>{intl.formatMessage({ id: "nav.about" })}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
