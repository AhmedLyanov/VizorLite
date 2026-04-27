import styles from "./RoomControlPanel.module.css";
import { Icon } from "../../shared/assets/icons/Icon";
import { useState, useCallback } from "react";
import { Tooltip, message } from "antd";
import LeaveRoomModal from "../leaveRoom/LeaveRoom";
import { useIntl } from "react-intl";
import { ROOM_BOARD_TEXTS } from "../../shared/constants/roomBoard";
import MicLevelVisualizer from "../../shared/ui/waveform/MicLevelVisualizer";
import sendIcon from "../../shared/assets/send.svg";
import { useChatStore } from "../../entities/chat/useChatStore";
import RoomBoardControl from "../buttonRoomBoard/ButtonRoomBoard";

import { MicSettings } from "../deviceSettings/";
import { CameraSettings } from "../deviceSettings";
import { ShareSettings } from "../deviceSettings";

import { useDeviceStore } from "../../entities/device/model/store";
import { useAutoMute } from "../../entities/device/useAutoMute";

interface RoomControlPanelProps {
  stream: MediaStream | null;
  onLeaveRoom: () => void;
  onToggleCamera?: () => void;
  isCameraOn?: boolean;
  onToggleScreenShare?: () => void;
  isScreenSharing?: boolean;
  participantCount?: number;
}

export default function RoomControlPanel({
  stream,
  onLeaveRoom,
  onToggleCamera,
  isCameraOn = true,
  onToggleScreenShare,
  isScreenSharing = false,
  participantCount = 0,
}: RoomControlPanelProps) {
  const intl = useIntl();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { isOpen: isChatOpen, unreadCount, toggleChat, resetUnreadCount } =
    useChatStore();

  const {
    autoMute,
    autoMuteThreshold,
    autoMuteDelay,
  } = useDeviceStore();

  const toggleMicrophone = useCallback(() => {
    if (!stream) return;

    const audioTracks = stream.getAudioTracks();
    audioTracks.forEach((track) => (track.enabled = !track.enabled));

    const newState = !isMicOn;
    setIsMicOn(newState);

    messageApi.open({
      type: newState ? "success" : "warning",
      content: newState
        ? intl.formatMessage({ id: ROOM_BOARD_TEXTS.MESSAGES.MIC_ENABLED })
        : intl.formatMessage({ id: ROOM_BOARD_TEXTS.MESSAGES.MIC_DISABLED }),
      duration: 2,
    });
  }, [stream, isMicOn, messageApi, intl]);


  useAutoMute({
    stream,
    enabled: autoMute,
    threshold: autoMuteThreshold,
    delay: autoMuteDelay,
    onMute: () => {
      if (!stream) return;

      stream.getAudioTracks().forEach((t) => (t.enabled = false));
      setIsMicOn(false);
    },
    onUnmute: () => {
      if (!stream) return;

      stream.getAudioTracks().forEach((t) => (t.enabled = true));
      setIsMicOn(true);
    },
  });

  const handleToggleCamera = useCallback(() => {
    if (onToggleCamera) {
      onToggleCamera();

      messageApi.open({
        type: !isCameraOn ? "success" : "warning",
        content: !isCameraOn
          ? intl.formatMessage({
              id: ROOM_BOARD_TEXTS.MESSAGES.CAMERA_ENABLED,
            })
          : intl.formatMessage({
              id: ROOM_BOARD_TEXTS.MESSAGES.CAMERA_DISABLED,
            }),
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
          ? intl.formatMessage({
              id: ROOM_BOARD_TEXTS.MESSAGES.SCREEN_SHARE_STARTED,
            })
          : intl.formatMessage({
              id: ROOM_BOARD_TEXTS.MESSAGES.SCREEN_SHARE_STOPPED,
            }),
        duration: 2,
      });
    }
  }, [onToggleScreenShare, isScreenSharing, messageApi, intl]);

  const handleLeaveRoom = useCallback(() => setIsLeaveModalOpen(true), []);

  const confirmLeaveRoom = useCallback(() => {
    setIsLeaveModalOpen(false);
    onLeaveRoom();
  }, [onLeaveRoom]);

  const cancelLeaveRoom = useCallback(
    () => setIsLeaveModalOpen(false),
    [],
  );

  const copyRoomLink = useCallback(() => {
    const shareMessage = intl.formatMessage({
      id: ROOM_BOARD_TEXTS.SHARE.MESSAGE,
    });

    const roomLink = `${shareMessage}\n${window.location.href}`;

    navigator.clipboard
      .writeText(roomLink)
      .then(() =>
        messageApi.success(
          intl.formatMessage({
            id: ROOM_BOARD_TEXTS.MESSAGES.LINK_COPIED,
          }),
          2,
        ),
      )
      .catch(() =>
        messageApi.error(
          intl.formatMessage({
            id: ROOM_BOARD_TEXTS.MESSAGES.LINK_COPY_ERROR,
          }),
          2,
        ),
      );
  }, [messageApi, intl]);

  const handleToggleChat = () => {
    toggleChat();
    resetUnreadCount();
  };

  return (
    <>
      {contextHolder}

      <div className={styles.controlPanel}>
        <div className={styles.panelSection}>
          <MicLevelVisualizer stream={stream} />

          <div className={styles.leftGroup}>
            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: isMicOn
                  ? ROOM_BOARD_TEXTS.TOOLTIPS.MIC_ON
                  : ROOM_BOARD_TEXTS.TOOLTIPS.MIC_OFF,
              })}
            >
              <RoomBoardControl
                icon={<Icon name={isMicOn ? "micOn" : "micOff"} />}
                onClick={toggleMicrophone}
                active={!isMicOn}
                modalTitle={intl.formatMessage({
                  id: ROOM_BOARD_TEXTS.SETTINGS.MICROPHONE,
                })}
                modalContent={<MicSettings />}
              />
            </Tooltip>

            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: isCameraOn
                  ? ROOM_BOARD_TEXTS.TOOLTIPS.CAMERA_ON
                  : ROOM_BOARD_TEXTS.TOOLTIPS.CAMERA_OFF,
              })}
            >
              <RoomBoardControl
                icon={
                  <Icon name={isCameraOn ? "cameraOn" : "cameraOff"} />
                }
                onClick={handleToggleCamera}
                active={!isCameraOn}
                modalTitle={intl.formatMessage({
                  id: ROOM_BOARD_TEXTS.SETTINGS.CAMERA,
                })}
                modalContent={<CameraSettings />}
              />
            </Tooltip>
          </div>
        </div>


        <div className={styles.panelSection}>
          <div className={styles.centerControls}>
            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: isScreenSharing
                  ? ROOM_BOARD_TEXTS.TOOLTIPS.SCREEN_SHARE_STOP
                  : ROOM_BOARD_TEXTS.TOOLTIPS.SCREEN_SHARE_START,
              })}
            >
              <RoomBoardControl
                icon={
                  <Icon
                    name={
                      isScreenSharing
                        ? "screenShareOn"
                        : "screenShareOff"
                    }
                  />
                }
                onClick={handleToggleScreenShare}
                active={isScreenSharing}
                modalTitle={intl.formatMessage({
                  id: ROOM_BOARD_TEXTS.SETTINGS.SCREEN_SHARE,
                })}
                modalContent={<ShareSettings/>}
              />
            </Tooltip>

            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: ROOM_BOARD_TEXTS.TOOLTIPS.LEAVE_ROOM,
              })}
            >
              <RoomBoardControl
                icon={<Icon name="hangUp" />}
                variant="danger"
                onClick={handleLeaveRoom}
              />
            </Tooltip>
          </div>
        </div>

        <div className={styles.panelSection}>
          <div className={styles.rightControls}>
            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: ROOM_BOARD_TEXTS.TOOLTIPS.COPY_LINK,
              })}
            >
              <RoomBoardControl
                icon={<Icon name="link" />}
                onClick={copyRoomLink}
              />
            </Tooltip>

            <RoomBoardControl
              mode="display"
              icon={<Icon name="users" />}
              text={`${participantCount}`}
              variant="default"
              bg="#2E3038"
            />

            <div className={styles.chatWrapper}>
              <Tooltip
                placement="top"
                title={intl.formatMessage({
                  id: isChatOpen ? "chat.close" : "chat.open",
                })}
              >
                <RoomBoardControl
                  icon={<img src={sendIcon} alt="Chat" />}
                  onClick={handleToggleChat}
                  active={isChatOpen}
                />
              </Tooltip>

              {unreadCount > 0 && !isChatOpen && (
                <span className={styles.unreadBadge}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
          </div>
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