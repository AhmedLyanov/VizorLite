import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { JOINMEETING_TEXTS } from "../../shared/constants/joinMeeting";
import { useIntl } from "react-intl";
import styles from "./joinMeeting.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function JoinMeetingModal({ isOpen, onClose }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const intl = useIntl();

  if (!isOpen) return null;

  const extractRoomId = (input: string) => {
    const match = input.match(/room\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input.trim();
  };

  const validateInput = (input: string) => {
    const roomId = extractRoomId(input);
    
    if (!roomId) {
      return intl.formatMessage({ id: JOINMEETING_TEXTS.ERRORS.EMPTY });
    }
    
    if (roomId.length < 3) {
      return intl.formatMessage({ id: JOINMEETING_TEXTS.VALIDATION.MIN_LENGTH });
    }
    
    if (roomId.length > 50) {
      return intl.formatMessage({ id: JOINMEETING_TEXTS.VALIDATION.MAX_LENGTH });
    }
    
    return null;
  };

  const handleJoin = () => {
    const validationError = validateInput(value);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    const roomId = extractRoomId(value);
    navigate(`/room/${roomId}`);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (error) setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        <h2>{intl.formatMessage({ id: JOINMEETING_TEXTS.HERO.TITLE })}</h2>
        
      
        <input
          type="text"
          placeholder={intl.formatMessage({ id: JOINMEETING_TEXTS.INPUT.PLACEHOLDER })}
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className={`${styles.input} ${error ? styles.errorInput : ''}`}
          aria-label={intl.formatMessage({ id: JOINMEETING_TEXTS.LABELS.MEETING_LINK })}
        />

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <div className={styles.actions}>
          <button 
            onClick={onClose}
            className={styles.secondaryButton}
          >
            {intl.formatMessage({ id: JOINMEETING_TEXTS.BUTTONS.CANCEL })}
          </button>
          <button 
            onClick={handleJoin}
            className={styles.primaryButton}
            disabled={!value.trim()}
          >
            {intl.formatMessage({ id: JOINMEETING_TEXTS.BUTTONS.JOIN })}
          </button>
        </div>
      </div>
    </div>
  );
}