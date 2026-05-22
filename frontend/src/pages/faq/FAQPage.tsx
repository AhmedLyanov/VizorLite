import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import InstallBanner from "@/widgets/installBanner/InstallBanner";
import { FAQ_TEXTS } from "@/shared/constants";
import homeIcon from "@/shared/assets/home.svg";
import diamondIcon from "@/shared/assets/diamond.svg";
import questionIcon from "@/shared/assets/question.svg";
import sendIcon from "@/shared/assets/send.svg";

import styles from "./FAQPage.module.css";

type FAQItemType = typeof FAQ_TEXTS.QUESTIONS[number];

const FAQPage: React.FC = () => {
  const intl = useIntl();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const questionsByCategory = FAQ_TEXTS.QUESTIONS.reduce<Record<string, FAQItemType[]>>(
    (acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {}
  );

  const getCategoryTitle = (category: string): string => {
    const categoryMap: Record<string, string> = {
      general: FAQ_TEXTS.CATEGORIES.GENERAL,
      technical: FAQ_TEXTS.CATEGORIES.TECHNICAL,
      security: FAQ_TEXTS.CATEGORIES.SECURITY,
      pricing: FAQ_TEXTS.CATEGORIES.PRICING,
    };
    return intl.formatMessage({ id: categoryMap[category] });
  };

  return (
    <div className={styles.faqPage}>
      <div className={styles.contentContainer}>
        <h1 className={styles.mainTitle}>
          {intl.formatMessage({ id: FAQ_TEXTS.HERO.TITLE })}
        </h1>
        <p className={styles.subtitle}>
          {intl.formatMessage({ id: FAQ_TEXTS.HERO.SUBTITLE })}
        </p>

        {Object.entries(questionsByCategory).map(([category, questions]) => (
          <section key={category} className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>{getCategoryTitle(category)}</h2>
            <div className={styles.faqList}>
              {questions.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.faqItem} ${
                    openItems.has(item.id) ? styles.faqItemOpen : ""
                  }`}
                >
                  <button
                    className={styles.faqQuestion}
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={openItems.has(item.id)}
                  >
                    <span>{intl.formatMessage({ id: item.question })}</span>
                    <span className={styles.faqIcon}>
                      {openItems.has(item.id) ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    className={`${styles.faqAnswer} ${
                      openItems.has(item.id) ? styles.faqAnswerOpen : ""
                    }`}
                  >
                    {intl.formatMessage({ id: item.answer })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <InstallBanner />
      </div>
      <div className={styles.bottomContent}>
        <div className={styles.bottomLinks}>
          <Link to="/" className={styles.bottomLink}>
            <img src={homeIcon} alt="" className={styles.linkIcon} />
            {intl.formatMessage({ id: "about.bottomLinks.items.home.label" })}
          </Link>
          <Link to="/pricing" className={styles.bottomLink}>
            <img src={diamondIcon} alt="" className={styles.linkIcon} />
            {intl.formatMessage({ id: "about.bottomLinks.items.pricing.label" })}
          </Link>
          <Link to="/about" className={styles.bottomLink}>
            <img src={questionIcon} alt="" className={styles.linkIcon} />
            {intl.formatMessage({ id: "about.bottomLinks.items.about.label" })}
          </Link>
          <a href="mailto:support@vizorlite.com" className={styles.bottomLink}>
            <img src={sendIcon} alt="" className={styles.linkIcon} />
            {intl.formatMessage({ id: "about.bottomLinks.items.contacts.label" })}
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;