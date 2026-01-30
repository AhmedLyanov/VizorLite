import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import styles from "./AboutPage.module.css";
import InstallBanner from "../../widgets/installBanner/InstallBanner";
import { ABOUT_TEXTS } from "../../shared/constants";

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

          <div className={styles.valuesGrid}>
            {ABOUT_TEXTS.VALUES.ITEMS.map((value, index) => (
              <div key={index} className={styles.valueItem}>
                <img
                  src={`@/shared/assets/${intl.formatMessage({ id: value.ICON })}`}
                  alt={intl.formatMessage({ id: value.TITLE })}
                  className={styles.valueIcon}
                />
                <div className={styles.valueContent}>
                  <h3>{intl.formatMessage({ id: value.TITLE })}</h3>
                  <p>{intl.formatMessage({ id: value.DESCRIPTION })}</p>
                </div>
              </div>
            ))}
          </div>
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
            {ABOUT_TEXTS.TEAM.ITEMS.map((member) => (
              <div  className={styles.teamCard}>
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
          {ABOUT_TEXTS.BOTTOM_LINKS.ITEMS.map((link, index) => {
            const label = intl.formatMessage({ id: link.LABEL });
            const iconSrc = `@/shared/assets/${intl.formatMessage({ id: link.ICON })}`;
            
            if ("HREF" in link) {
              return (
                <a
                  key={index}
                  href={link.HREF}
                  className={styles.bottomLink}
                  title={label}
                >
                  <img
                    src={iconSrc}
                    alt={label}
                    className={styles.linkIcon}
                  />
                  {label}
                </a>
              );
            }

            return (
              <Link
                key={index}
                to={link.PATH}
                className={styles.bottomLink}
                title={label}
              >
                <img
                  src={iconSrc}
                  alt={label}
                  className={styles.linkIcon}
                />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;