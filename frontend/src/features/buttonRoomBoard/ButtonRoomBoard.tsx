import type { ReactNode } from "react";
import { useRef, useState, useCallback, useEffect } from "react";
import { Modal } from "antd";
import styles from "./ButtonRoomBoard.module.css";

type Props = {
  icon: ReactNode;
  onClick?: () => void;
  active?: boolean;
  bg?: string;
  borderColor?: string;
  iconColor?: string;
  variant?: "default" | "danger" | "success";
  mode?: "button" | "display";
  text?: string;
  modalTitle?: string;
  modalContent?: ReactNode;
  onModalSave?: () => void;
};

export default function RoomBoardControl({
  icon,
  onClick,
  active = false,
  bg,
  borderColor,
  iconColor = "#D1D5DB",
  variant = "default",
  mode = "button",
  text,
  modalTitle,
  modalContent,
  onModalSave,
}: Props) {
  const optionsRef = useRef<HTMLButtonElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});
  const hasOptions = Boolean(modalTitle && modalContent);

  const handleOptionsClick = useCallback(() => {
    const el = optionsRef.current;
    if (el) {
      setIsModalOpen(true);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleModalSave = useCallback(() => {
    onModalSave?.();
    closeModal();
  }, [onModalSave, closeModal]);

  useEffect(() => {
    if (!isModalOpen || !optionsRef.current) return;
    const updatePosition = () => {
      const rect = optionsRef.current!.getBoundingClientRect();
      const modalWidth = 420;
      const modalHeight = 520;
      const padding = 16;

      let top = rect.bottom + window.scrollY + 8;
      let left = rect.right + window.scrollX - modalWidth;

      if (left < padding) left = padding;
      if (left + modalWidth > window.innerWidth - padding) {
        left = window.innerWidth - modalWidth - padding;
      }
      if (top + modalHeight > window.innerHeight + window.scrollY - padding) {
        top = rect.top + window.scrollY - modalHeight - 8;
        if (top < padding) top = padding;
      }

      setModalStyle({ top, left, position: 'fixed' });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isModalOpen]);

  const variants = {
    default: { bg: active ? "#2E3038" : "transparent", border: "#2E3038" },
    danger: { bg: "#C74E5B", border: "#270005" },
    success: { bg: "#34C759", border: "#34C759" },
  };

  const current = variants[variant];

  if (mode === "display") {
    return (
      <div
        className={styles.displayBlock}
        style={{
          background: bg ?? current.bg,
          border: bg || variant !== "default" ? "none" : `2px solid ${borderColor ?? current.border}`,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "8px",
        }}
      >
        <span style={{ color: iconColor }}>{icon}</span>
        {text && <span className={styles.displayText}>{text}</span>}
      </div>
    );
  }

  return (
    <>
      <div
        className={styles.container}
        style={{
          background: bg ?? current.bg,
          border: bg || variant !== "default" ? "none" : `2px solid ${borderColor ?? current.border}`,
        }}
      >
        <button className={styles.main} onClick={onClick}>
          <span style={{ color: iconColor }}>{icon}</span>
        </button>

        {hasOptions && (
          <>
            <div className={styles.divider} style={{ background: borderColor ?? current.border }} />
            <button
              ref={optionsRef}
              className={styles.options}
              onClick={handleOptionsClick}
            >
              <span className={styles.dots} />
            </button>
          </>
        )}
      </div>

      {hasOptions && (
        <Modal
          title={modalTitle}
          open={isModalOpen}
          onOk={handleModalSave}
          onCancel={closeModal}
          okText="Сохранить"
          cancelText="Отмена"
          width={420}
          mask={false}
          style={modalStyle}
          destroyOnClose
          centered={false}
        >
          {modalContent}
        </Modal>
      )}
    </>
  );
}