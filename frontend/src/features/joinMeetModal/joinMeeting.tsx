import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";

import { JOINMEETING_TEXTS } from "@/shared/constants/joinMeeting";

import styles from "./joinMeeting.module.css";

import { CustomModal } from "@/shared/ui/customModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function JoinMeetingModal({ isOpen, onClose }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const intl = useIntl();

  const handleJoin = () => {
    if (!value.trim()) {
      setError("Invalid room id");
      return;
    }

    navigate(`/room/${value}`);
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={intl.formatMessage({
        id: JOINMEETING_TEXTS.HERO.TITLE,
      })}
      footer={
        <>
          <button className={styles.secondaryButton} onClick={onClose}>
            {intl.formatMessage({
              id: JOINMEETING_TEXTS.BUTTONS.CANCEL,
            })}
          </button>

          <button
            className={styles.primaryButton}
            onClick={handleJoin}
            disabled={!value.trim()}
          >
            {intl.formatMessage({
              id: JOINMEETING_TEXTS.BUTTONS.JOIN,
            })}
          </button>
        </>
      }
    >
      <>
        <input
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={intl.formatMessage({
            id: JOINMEETING_TEXTS.INPUT.PLACEHOLDER,
          })}
        />

        {error && <p className={styles.error}>{error}</p>}
      </>
    </CustomModal>
  );
}
