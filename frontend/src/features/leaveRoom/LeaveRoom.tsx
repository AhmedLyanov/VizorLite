import React from 'react';
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
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Покинуть комнату?</h2>
        <p className={styles.description}>
          Вы уверены, что хотите выйти из видеоконференции?
        </p>
        <div className={styles.actions}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
          >
            Отмена
          </button>
          <button 
            className={styles.confirmButton} 
            onClick={onConfirm}
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveRoomModal;