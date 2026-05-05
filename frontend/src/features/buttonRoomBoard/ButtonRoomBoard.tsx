import type { ReactNode } from "react";
import { useState } from "react";
import { Popover } from "antd";

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
}: Props) {
  const [open, setOpen] = useState(false);
  const hasOptions = Boolean(modalContent);

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
          border:
            bg || variant !== "default"
              ? "none"
              : `2px solid ${borderColor ?? current.border}`,
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
    <div
      className={styles.container}
      style={{
        background: bg ?? current.bg,
        border:
          bg || variant !== "default"
            ? "none"
            : `2px solid ${borderColor ?? current.border}`,
      }}
    >

      <button className={styles.main} onClick={onClick}>
        <span style={{ color: iconColor }}>{icon}</span>
      </button>

      {hasOptions && (
        <>
          <div
            className={styles.divider}
            style={{ background: borderColor ?? current.border }}
          />

          <Popover
            open={open}
            onOpenChange={setOpen}
            trigger="click"
            placement="top"
            content={
              <div className={styles.popoverContent}>
                {modalTitle && (
                  <div className={styles.popoverTitle}>
                    {modalTitle}
                  </div>
                )}
                {modalContent}
              </div>
            }
          >
            <button
              className={styles.options}
              onClick={(e) => e.stopPropagation()}
            >
              <span className={styles.dots} />
            </button>
          </Popover>
        </>
      )}
    </div>
  );
}