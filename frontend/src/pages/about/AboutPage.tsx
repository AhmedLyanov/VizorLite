import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import InstallBanner from "@/widgets/installBanner/InstallBanner";
import { ABOUT_TEXTS } from "@/shared/constants";
import homeIcon from "@/shared/assets/home.svg";
import dollarIcon from "@/shared/assets/dollar.svg";
import questionIcon from "@/shared/assets/question.svg";
import sendIcon from "@/shared/assets/send.svg";

import styles from "./AboutPage.module.css";

const AboutPage: React.FC = () => {
  const intl = useIntl();

  return (
    <div className={styles.aboutPage}>
      <div className={styles.contentContainer}>
        <h1 className={styles.mainTitle}>
          {intl.formatMessage({ id: ABOUT_TEXTS.HERO.TITLE })}
        </h1>
        <p className={styles.subtitle}>
          {intl.formatMessage({ id: ABOUT_TEXTS.HERO.SUBTITLE })}
        </p>

        <section className={styles.missionSection}>
          <h2 className={styles.missionTitle}>
            {intl.formatMessage({ id: ABOUT_TEXTS.MISSION.TITLE })}
          </h2>
          <p className={styles.missionText}>
            {intl.formatMessage({ id: ABOUT_TEXTS.MISSION.DESCRIPTION })}
          </p>

        </section>
        <section className={styles.statsSection}>
          <h2 className={styles.statsTitle}>
            {intl.formatMessage({ id: ABOUT_TEXTS.STATS.TITLE })}
          </h2>
          <div className={styles.statsGrid}>
            {ABOUT_TEXTS.STATS.ITEMS.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statValue}>
                  {intl.formatMessage({ id: stat.VALUE })}
                </div>
                <div className={styles.statLabel}>
                  {intl.formatMessage({ id: stat.LABEL })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.teamSection}>
          <h2 className={styles.teamTitle}>
            {intl.formatMessage({ id: ABOUT_TEXTS.TEAM.TITLE })}
          </h2>
          <div className={styles.teamGrid}>
            {ABOUT_TEXTS.TEAM.ITEMS.map((member, idx) => (
              <div key={idx} className={styles.teamCard}>
                <div className={styles.memberImage}>
                  <svg className={styles.placeholderIcon} viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
                    />
                  </svg>
                </div>
                <h3 className={styles.memberName}>
                  {intl.formatMessage({ id: member.NAME })}
                </h3>
                <p className={styles.memberRole}>
                  {intl.formatMessage({ id: member.ROLE })}
                </p>
                <p className={styles.memberDescription}>
                  {intl.formatMessage({ id: member.DESCRIPTION })}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.timelineSection}>
          <h2 className={styles.timelineTitle}>
            {intl.formatMessage({ id: ABOUT_TEXTS.TIMELINE.TITLE })}
          </h2>
          <div className={styles.timeline}>
            {ABOUT_TEXTS.TIMELINE.ITEMS.map((milestone, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{milestone.YEAR}</div>
                <p className={styles.timelineEvent}>
                  {intl.formatMessage({ id: milestone.EVENT })}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>
            {intl.formatMessage({ id: ABOUT_TEXTS.CTA.TITLE })}
          </h2>
          <p className={styles.ctaText}>
            {intl.formatMessage({ id: ABOUT_TEXTS.CTA.DESCRIPTION })}
          </p>
          <Link to="/" className={styles.ctaButton}>
            {intl.formatMessage({ id: ABOUT_TEXTS.CTA.BUTTON_TEXT })}
          </Link>
        </section>

        <InstallBanner />
      </div>
      <div className={styles.bottomContent}>
        <div className={styles.bottomLinks}>
          <Link to="/" className={styles.bottomLink}>
            <img src={homeIcon} alt="" className={styles.linkIcon} />
            {intl.formatMessage({ id: "about.bottomLinks.items.home.label" })}
          </Link>
          <Link to="/pricing" className={styles.bottomLink}>
            <img src={dollarIcon} alt="" className={styles.linkIcon} />
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

export default AboutPage;