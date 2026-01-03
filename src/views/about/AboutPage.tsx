import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AboutPage.module.css';
import InstallBanner from '../../components/ui/installBanner/InstallBanner';
import { TEXTS } from '../../constants'; 

const AboutPage: React.FC = () => {
  const { ABOUT } = TEXTS;

  return (
    <div className={styles.aboutPage}>
      <div className={styles.contentContainer}>
        
        <h1 className={styles.mainTitle}>{ABOUT.HERO.TITLE}</h1>
        <p className={styles.subtitle}>{ABOUT.HERO.SUBTITLE}</p>

        <section className={styles.missionSection}>
          <h2 className={styles.missionTitle}>{ABOUT.MISSION.TITLE}</h2>
          <p className={styles.missionText}>{ABOUT.MISSION.DESCRIPTION}</p>
          
          <div className={styles.valuesGrid}>
            {ABOUT.VALUES.ITEMS.map((value, index) => (
              <div key={index} className={styles.valueItem}>
                <img 
                  src={`/images/${value.ICON}`} 
                  alt={value.TITLE}
                  className={styles.valueIcon}
                />
                <div className={styles.valueContent}>
                  <h3>{value.TITLE}</h3>
                  <p>{value.DESCRIPTION}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.statsSection}>
          <h2 className={styles.statsTitle}>{ABOUT.STATS.TITLE}</h2>
          <div className={styles.statsGrid}>
            {ABOUT.STATS.ITEMS.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statValue}>{stat.VALUE}</div>
                <div className={styles.statLabel}>{stat.LABEL}</div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.teamSection}>
          <h2 className={styles.teamTitle}>{ABOUT.TEAM.TITLE}</h2>
          <div className={styles.teamGrid}>
            {ABOUT.TEAM.ITEMS.map(member => (
              <div key={member.ID} className={styles.teamCard}>
                <div className={styles.memberImage}>
                  <svg className={styles.placeholderIcon} viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                  </svg>
                </div>
                <h3 className={styles.memberName}>{member.NAME}</h3>
                <p className={styles.memberRole}>{member.ROLE}</p>
                <p className={styles.memberDescription}>{member.DESCRIPTION}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.timelineSection}>
          <h2 className={styles.timelineTitle}>{ABOUT.TIMELINE.TITLE}</h2>
          <div className={styles.timeline}>
            {ABOUT.TIMELINE.ITEMS.map((milestone, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{milestone.YEAR}</div>
                <p className={styles.timelineEvent}>{milestone.EVENT}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>{ABOUT.CTA.TITLE}</h2>
          <p className={styles.ctaText}>{ABOUT.CTA.DESCRIPTION}</p>
          <Link to="/" className={styles.ctaButton}>
            {ABOUT.CTA.BUTTON_TEXT}
          </Link>
        </section>

        <InstallBanner />
      </div>

      <div className={styles.bottomContent}>
        <div className={styles.bottomLinks}>
          {ABOUT.BOTTOM_LINKS.ITEMS.map((link, index) => {
            if ('HREF' in link) {
              return (
                <a 
                  key={index} 
                  href={link.HREF} 
                  className={styles.bottomLink}
                >
                  <img 
                    src={`/images/${link.ICON}`} 
                    alt={link.LABEL} 
                    className={styles.linkIcon} 
                  />
                  {link.LABEL}
                </a>
              );
            }
            
            return (
              <Link 
                key={index} 
                to={link.PATH} 
                className={styles.bottomLink}
              >
                <img 
                  src={`/images/${link.ICON}`} 
                  alt={link.LABEL} 
                  className={styles.linkIcon} 
                />
                {link.LABEL}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;