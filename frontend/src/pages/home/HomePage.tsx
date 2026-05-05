import { Link } from "react-router-dom";
import { useState } from "react";
import { useIntl } from "react-intl";

import { HOME_TEXTS } from "@/shared/constants";

import BigButton from "@/shared/ui/button/BigButton/BigButton";
import { useCreateMeeting } from "@/features/room";
import LanguageSwitcher from "@/features/LanguageSwitcher/LanguageSwitcher";
import JoinMeetingModal from "@/features/joinMeetModal/joinMeeting";
import InstallBanner from "@/widgets/installBanner/InstallBanner";

import webcamIcon from "@/shared/assets/webcamera.svg";
import joinIcon from "@/shared/assets/join.svg";
import scheduleMeeting from "@/shared/assets/schedulemeeting.svg";
import dollarIcon from "@/shared/assets/dollar.svg";
import questionIcon from "@/shared/assets/question.svg";

import styles from "./HomePage.module.css";


export default function HomePage() {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const createMeetingMutation = useCreateMeeting();
  const intl = useIntl();

  return (
    <section className={styles.sectionContent}>
      <InstallBanner />

      <div className={styles.contentContainer}>
        <h1 className={styles.mainTitle}>
          {intl.formatMessage({ id: HOME_TEXTS.HERO.TITLE })}
        </h1>

        <div className={styles.containerBigbuttons}>
          <div className={styles.bigButtonsBox}>
            <BigButton
              title={intl.formatMessage({
                id: HOME_TEXTS.BUTTONS.CREATE_MEETING,
              })}
              active={true}

              image={webcamIcon}
              onClick={() => createMeetingMutation.mutate()}
            />

            <BigButton
              title={intl.formatMessage({
                id: HOME_TEXTS.BUTTONS.JOIN_MEETING,
              })}
              active={true}

              image={joinIcon}
              onClick={() => setIsJoinOpen(true)}
            />
          </div>

          <BigButton
            title={intl.formatMessage({
              id: HOME_TEXTS.BUTTONS.SCHEDULE_MEETING,
            })}
            active={false}

            image={scheduleMeeting}
          />
        </div>

        <JoinMeetingModal
          isOpen={isJoinOpen}
          onClose={() => setIsJoinOpen(false)}
        />
      </div>

      <div className={styles.bottomContent}>
        <div className={styles.bottomUtilsButtons}>
          <Link to="/pricing" className={styles.bottomUtilsButton}>
            <img src={dollarIcon} alt="" className={styles.linkIcon} />
            <span>{intl.formatMessage({ id: HOME_TEXTS.BOTTOM.PRICING })}</span>
          </Link>

          <LanguageSwitcher />

          <Link to="/faq" className={styles.bottomUtilsButton}>
            <img src={questionIcon} alt="" className={styles.linkIcon} />
            <span>{intl.formatMessage({ id: HOME_TEXTS.BOTTOM.FAQ })}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
