import React from 'react';
import { useIntl } from 'react-intl';
import { ROOM_BOARD_TEXTS } from '../../shared/constants/roomBoard';
import styles from './LeaveRoom.module.css';

interface LeaveRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LeaveRoomModal: React.FC<LeaveRoomModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const intl = useIntl();
  
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{intl.formatMessage({ id: ROOM_BOARD_TEXTS.MODAL.TITLE })}</h2>
        <p className={styles.description}>
          {intl.formatMessage({ id: ROOM_BOARD_TEXTS.MODAL.DESCRIPTION })}
        </p>
        <div className={styles.actions}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
          >
            {intl.formatMessage({ id: ROOM_BOARD_TEXTS.MODAL.CANCEL })}
          </button>
          <button 
            className={styles.confirmButton} 
            onClick={onConfirm}
          >
            {intl.formatMessage({ id: ROOM_BOARD_TEXTS.MODAL.CONFIRM })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveRoomModal;