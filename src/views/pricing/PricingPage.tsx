import { Link } from "react-router-dom";
import { PRICING_TEXTS } from "../../constants/pricing";
import styles from "./Pricing.module.css";

export default function PricingPage() {
  return (
    <section className={styles.sectionContent}>
      <div className={styles.contentContainer}>
        <h1 className={styles.mainTitle}>{PRICING_TEXTS.TITLE}</h1>
        <p className={styles.subtitle}>{PRICING_TEXTS.SUBTITLE}</p>
        
        <div className={styles.pricingCards}>
          <div className={styles.pricingCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.planName}>{PRICING_TEXTS.PLANS.BASIC.NAME}</h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>{PRICING_TEXTS.PLANS.BASIC.PRICE}</span>
                <span className={styles.period}>{PRICING_TEXTS.PLANS.BASIC.PERIOD}</span>
              </div>
            </div>
            
            <div className={styles.featuresList}>
              {PRICING_TEXTS.PLANS.BASIC.FEATURES.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <img src="/images/check.svg" alt="" className={styles.featureIcon} />
                  <span className={styles.featureText}>{feature}</span>
                </div>
              ))}
            </div>
            
            <button className={styles.selectButton}>
              {PRICING_TEXTS.SELECT_BUTTON}
            </button>
          </div>
          
          <div className={`${styles.pricingCard} ${styles.recommended}`}>
            <div className={styles.recommendedBadge}>{PRICING_TEXTS.RECOMMENDED}</div>
            <div className={styles.cardHeader}>
              <h3 className={styles.planName}>{PRICING_TEXTS.PLANS.BUSINESS.NAME}</h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>{PRICING_TEXTS.PLANS.BUSINESS.PRICE}</span>
                <span className={styles.period}>{PRICING_TEXTS.PLANS.BUSINESS.PERIOD}</span>
              </div>
            </div>
            
            <div className={styles.featuresList}>
              {PRICING_TEXTS.PLANS.BUSINESS.FEATURES.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <img src="/images/check.svg" alt="" className={styles.featureIcon} />
                  <span className={styles.featureText}>{feature}</span>
                </div>
              ))}
            </div>
            
            <button className={`${styles.selectButton} ${styles.recommendedButton}`}>
              {PRICING_TEXTS.SELECT_BUTTON}
            </button>
          </div>
          
          <div className={styles.pricingCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.planName}>{PRICING_TEXTS.PLANS.PREMIUM.NAME}</h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>{PRICING_TEXTS.PLANS.PREMIUM.PRICE}</span>
                <span className={styles.period}>{PRICING_TEXTS.PLANS.PREMIUM.PERIOD}</span>
              </div>
            </div>
            
            <div className={styles.featuresList}>
              {PRICING_TEXTS.PLANS.PREMIUM.FEATURES.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <img src="/images/check.svg" alt="" className={styles.featureIcon} />
                  <span className={styles.featureText}>{feature}</span>
                </div>
              ))}
            </div>
            
            <button className={styles.selectButton}>
              {PRICING_TEXTS.SELECT_BUTTON}
            </button>
          </div>
        </div>
        
        <div className={styles.faqSection}>
          <h2 className={styles.faqTitle}>{PRICING_TEXTS.FAQ.TITLE}</h2>
          <div className={styles.faqList}>
            {PRICING_TEXTS.FAQ.ITEMS.map((item, index) => (
              <div key={index} className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>{item.question}</h4>
                <p className={styles.faqAnswer}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.bottomContent}>
        <div className={styles.bottomLinks}>
          <Link to="/" className={styles.bottomLink}>
            <img src="/images/home.svg" alt="Главная" className={styles.linkIcon} />
            <span>Главная</span>
          </Link>
          <Link to="/faq" className={styles.bottomLink}>
            <img src="/images/question.svg" alt="Вопросы" className={styles.linkIcon} />
            <span>Поддержка</span>
          </Link>
        </div>
      </div>
    </section>
  );
}