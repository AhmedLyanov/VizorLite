import styles from "./RoomBoard.module.css";
import { Icon } from "../../shared/assets/icons/Icon";
import { useState, useCallback } from "react";
import { Tooltip, message } from 'antd';

interface RoomBoardProps {
  stream: MediaStream | null;
  onLeaveRoom: () => void;
  onToggleCamera?: () => void;
  isCameraOn?: boolean;
}

export default function RoomBoard({ 
  stream, 
  onLeaveRoom,
  onToggleCamera,
  isCameraOn = true
}: RoomBoardProps) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const toggleMicrophone = useCallback(() => {
    if (!stream) return;
    
    const audioTracks = stream.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = !track.enabled;
    });
    
    setIsMicOn(prev => !prev);
    
    messageApi.open({
      type: isMicOn ? 'warning' : 'success',
      content: isMicOn ? 'Микрофон выключен' : 'Микрофон включен',
      duration: 2,
    });
  }, [stream, isMicOn, messageApi]);

  const handleLeaveRoom = useCallback(() => {
    if (confirm("Вы уверены, что хотите покинуть комнату?")) {
      onLeaveRoom();
    }
  }, [onLeaveRoom]);

  const copyRoomLink = useCallback(() => {
    const roomLink = window.location.href;
    navigator.clipboard.writeText(roomLink).then(() => {
      messageApi.success('Ссылка на комнату скопирована!', 2);
    }).catch(() => {
      messageApi.error('Не удалось скопировать ссылку', 2);
    });
  }, [messageApi]);

  return (
    <>
      {contextHolder}
      <div className={styles.roomBoardContainer}>
        <div className={styles.roomBoardContent}>
          <Tooltip placement="top" title={isMicOn ? "Выключить микрофон" : "Включить микрофон"}>
            <button 
              onClick={toggleMicrophone} 
              className={`${styles.roomBoardButton} ${!isMicOn ? styles.buttonActive : ''}`}
            >
              <Icon name={isMicOn ? "micOn" : "micOff"} />
              <span className={styles.buttonLabel}>Микрофон</span>
            </button>
          </Tooltip>
          
          <Tooltip placement="top" title={isCameraOn ? "Выключить камеру" : "Включить камеру"}>
            <button 
              onClick={onToggleCamera} 
              className={`${styles.roomBoardButton} ${!isCameraOn ? styles.buttonActive : ''}`}
            >
              <Icon name={isCameraOn ? "cameraOn" : "cameraOff"} />
              <span className={styles.buttonLabel}>Камера</span>
            </button>
          </Tooltip>

          <Tooltip placement="top" title="Копировать ссылку на комнату">
            <button 
              onClick={copyRoomLink}
              className={styles.roomBoardButton}
            >
              <Icon name="link" />
              <span className={styles.buttonLabel}>Ссылка</span>
            </button>
          </Tooltip>
          
          <Tooltip placement="top" title="Покинуть комнату">
            <button 
              onClick={handleLeaveRoom}
              className={`${styles.roomBoardButton} ${styles.buttonLeave}`}
            >
              <Icon name="hangUp" />
              <span className={styles.buttonLabel}>Выйти</span>
            </button>
          </Tooltip>
        </div>
      </div>
    </>
  );
}