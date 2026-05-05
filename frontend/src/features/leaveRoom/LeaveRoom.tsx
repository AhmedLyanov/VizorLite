import { useIntl } from "react-intl";

import { ROOM_BOARD_TEXTS } from "@/shared/constants/roomBoard";

import styles from "./LeaveRoom.module.css";

import { CustomModal } from "@/shared/ui/customModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LeaveRoomModal({ isOpen, onClose, onConfirm }: Props) {
  const intl = useIntl();

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={intl.formatMessage({
        id: ROOM_BOARD_TEXTS.MODAL.TITLE,
      })}
      footer={
        <>
          <button className={styles.cancelButton} onClick={onClose}>
            {intl.formatMessage({
              id: ROOM_BOARD_TEXTS.MODAL.CANCEL,
            })}
          </button>

          <button className={styles.confirmButton} onClick={onConfirm}>
            {intl.formatMessage({
              id: ROOM_BOARD_TEXTS.MODAL.CONFIRM,
            })}
          </button>
        </>
      }
    >
      <p className={styles.description}>
        {intl.formatMessage({
          id: ROOM_BOARD_TEXTS.MODAL.DESCRIPTION,
        })}
      </p>
    </CustomModal>
  );
}
