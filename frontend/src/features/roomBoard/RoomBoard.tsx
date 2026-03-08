import styles from "./RoomBoard.module.css";
import { Icon } from "../../shared/assets/icons/Icon";
import { useState, useCallback } from "react";
import { Tooltip, message } from "antd";
import LeaveRoomModal from "../leaveRoom/LeaveRoom";
import { useIntl } from "react-intl";
import { ROOM_BOARD_TEXTS } from "../../shared/constants/roomBoard";
import MicLevelVisualizer from "../../shared/ui/waveform/MicLevelVisualizer";

interface RoomBoardProps {
  stream: MediaStream | null;
  onLeaveRoom: () => void;
  onToggleCamera?: () => void;
  isCameraOn?: boolean;
  onToggleScreenShare?: () => void;
  isScreenSharing?: boolean;
}

export default function RoomBoard({
  stream,
  onLeaveRoom,
  onToggleCamera,
  isCameraOn = true,
  onToggleScreenShare,
  isScreenSharing = false,
}: RoomBoardProps) {
  const intl = useIntl();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const toggleMicrophone = useCallback(() => {
    if (!stream) return;

    const audioTracks = stream.getAudioTracks();
    audioTracks.forEach((track) => {
      track.enabled = !track.enabled;
    });

    const newMicState = !isMicOn;
    setIsMicOn(newMicState);

    messageApi.open({
      type: newMicState ? "success" : "warning",
      content: newMicState
        ? intl.formatMessage({ id: ROOM_BOARD_TEXTS.MESSAGES.MIC_ENABLED })
        : intl.formatMessage({ id: ROOM_BOARD_TEXTS.MESSAGES.MIC_DISABLED }),
      duration: 2,
    });
  }, [stream, isMicOn, messageApi, intl]);

  const handleToggleCamera = useCallback(() => {
    if (onToggleCamera) {
      onToggleCamera();
      messageApi.open({
        type: !isCameraOn ? "success" : "warning",
        content: !isCameraOn
          ? intl.formatMessage({ id: ROOM_BOARD_TEXTS.MESSAGES.CAMERA_ENABLED })
          : intl.formatMessage({ id: ROOM_BOARD_TEXTS.MESSAGES.CAMERA_DISABLED }),
        duration: 2,
      });
    }
  }, [onToggleCamera, isCameraOn, messageApi, intl]);

  const handleToggleScreenShare = useCallback(() => {
    if (onToggleScreenShare) {
      onToggleScreenShare();
      messageApi.open({
        type: !isScreenSharing ? "success" : "warning",
        content: !isScreenSharing
          ? intl.formatMessage({ id: ROOM_BOARD_TEXTS.MESSAGES.SCREEN_SHARE_STARTED })
          : intl.formatMessage({ id: ROOM_BOARD_TEXTS.MESSAGES.SCREEN_SHARE_STOPPED }),
        duration: 2,
      });
    }
  }, [onToggleScreenShare, isScreenSharing, messageApi, intl]);

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
    const shareMessage = intl.formatMessage({ id: ROOM_BOARD_TEXTS.SHARE.MESSAGE });
    const roomLink = `${shareMessage}\n${window.location.href}`;

    navigator.clipboard
      .writeText(roomLink)
      .then(() => {
        messageApi.success(
          intl.formatMessage({ id: ROOM_BOARD_TEXTS.MESSAGES.LINK_COPIED }),
          2
        );
      })
      .catch(() => {
        messageApi.error(
          intl.formatMessage({ id: ROOM_BOARD_TEXTS.MESSAGES.LINK_COPY_ERROR }),
          2
        );
      });
  }, [messageApi, intl]);

  return (
    <>
      {contextHolder}

      <div className={styles.roomBoardWaveformContainer}>
        <div className={styles.roomBoardWaveform}>
          <MicLevelVisualizer stream={stream} />
        </div>
      </div>

      <div className={styles.roomBoardContainer}>
        <div className={styles.roomBoardContent}>
          <Tooltip
            placement="top"
            title={intl.formatMessage({
              id: isMicOn
                ? ROOM_BOARD_TEXTS.TOOLTIPS.MIC_ON
                : ROOM_BOARD_TEXTS.TOOLTIPS.MIC_OFF,
            })}
          >
            <button
              onClick={toggleMicrophone}
              className={`${styles.roomBoardButton} ${
                !isMicOn ? styles.buttonActive : ""
              }`}
            >
              <Icon name={isMicOn ? "micOn" : "micOff"} />
            </button>
          </Tooltip>

          <Tooltip
            placement="top"
            title={intl.formatMessage({
              id: isCameraOn
                ? ROOM_BOARD_TEXTS.TOOLTIPS.CAMERA_ON
                : ROOM_BOARD_TEXTS.TOOLTIPS.CAMERA_OFF,
            })}
          >
            <button
              onClick={handleToggleCamera}
              className={`${styles.roomBoardButton} ${
                !isCameraOn ? styles.buttonActive : ""
              }`}
            >
              <Icon name={isCameraOn ? "cameraOn" : "cameraOff"} />
            </button>
          </Tooltip>

          <Tooltip
            placement="top"
            title={intl.formatMessage({
              id: isScreenSharing
                ? ROOM_BOARD_TEXTS.TOOLTIPS.SCREEN_SHARE_STOP
                : ROOM_BOARD_TEXTS.TOOLTIPS.SCREEN_SHARE_START,
            })}
          >
            <button
              onClick={handleToggleScreenShare}
              className={`${styles.roomBoardButton} ${
                isScreenSharing ? styles.buttonActive : ""
              }`}
              disabled={!onToggleScreenShare}
            >
              <Icon name={isScreenSharing ? "screenShareOn" : "screenShareOff"} />
            </button>
          </Tooltip>

          <Tooltip
            placement="top"
            title={intl.formatMessage({ id: ROOM_BOARD_TEXTS.TOOLTIPS.COPY_LINK })}
          >
            <button onClick={copyRoomLink} className={styles.roomBoardButton}>
              <Icon name="link" />
            </button>
          </Tooltip>

          <Tooltip
            placement="top"
            title={intl.formatMessage({ id: ROOM_BOARD_TEXTS.TOOLTIPS.LEAVE_ROOM })}
          >
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