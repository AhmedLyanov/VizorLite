import styles from "./RoomBoard.module.css";
import { Icon } from "../../shared/assets/icons/Icon";
import { useState, useCallback } from "react";
import { Tooltip, message } from 'antd';
import LeaveRoomModal from "../leaveRoom/LeaveRoom";

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
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false); 
  const [messageApi, contextHolder] = message.useMessage();

  const toggleMicrophone = useCallback(() => {
    if (!stream) return;
    
    const audioTracks = stream.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = !track.enabled;
    });
    
    const newMicState = !isMicOn;
    setIsMicOn(newMicState);
    
    messageApi.open({
      type: newMicState ? 'success' : 'warning',
      content: newMicState ? 'Микрофон включен' : 'Микрофон выключен',
      duration: 2,
    });
  }, [stream, isMicOn, messageApi]);

  const handleToggleCamera = useCallback(() => {
    if (onToggleCamera) {
      onToggleCamera();
      messageApi.open({
        type: !isCameraOn ? 'success' : 'warning',
        content: !isCameraOn ? 'Камера включена' : 'Камера выключена',
        duration: 2,
      });
    }
  }, [onToggleCamera, isCameraOn, messageApi]);

  const handleLeaveRoom = useCallback(() => {
    setIsLeaveModalOpen(true);
  }, []);

  const confirmLeaveRoom = useCallback(() => {
    setIsLeaveModalOpen(false);
    onLeaveRoom();
  }, [onLeaveRoom]);

  const cancelLeaveRoom = useCallback(() => {
    setIsLeaveModalOpen(false);
  }, []);

  const copyRoomLink = useCallback(() => {
    const roomLink = `Хей, привет! \nПрисоединяйся к видеовстрече, \nвот ссылка: ${window.location.href}`;
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
            </button>
          </Tooltip>
          
          <Tooltip placement="top" title={isCameraOn ? "Выключить камеру" : "Включить камеру"}>
            <button 
              onClick={handleToggleCamera} 
              className={`${styles.roomBoardButton} ${!isCameraOn ? styles.buttonActive : ''}`}
            >
              <Icon name={isCameraOn ? "cameraOn" : "cameraOff"} />
            </button>
          </Tooltip>

          <Tooltip placement="top" title="Копировать ссылку на комнату">
            <button 
              onClick={copyRoomLink}
              className={styles.roomBoardButton}
            >
              <Icon name="link" />
            </button>
          </Tooltip>
          
          <Tooltip placement="top" title="Покинуть комнату">
            <button 
              onClick={handleLeaveRoom}
              className={`${styles.roomBoardButton} ${styles.buttonLeave}`}
            >
              <Icon name="hangUp" />
            </button>
          </Tooltip>
        </div>
      </div>

      <LeaveRoomModal
        isOpen={isLeaveModalOpen}
        onClose={cancelLeaveRoom}
        onConfirm={confirmLeaveRoom}
      />
    </>
  );
}