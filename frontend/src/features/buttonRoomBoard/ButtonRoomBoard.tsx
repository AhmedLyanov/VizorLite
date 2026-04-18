import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  onClick?: () => void;
  hasOptions?: boolean;
  onOptionsClick?: () => void;
  active?: boolean;
  bg?: string;
  borderColor?: string;
  iconColor?: string;
  variant?: "default" | "danger" | "success";
};


import styles from "./ButtonRoomBoard.module.css";

export default function RoomBoardControl({
  icon,
  onClick,
  hasOptions = false,
  onOptionsClick,
  active = false,

  bg,
  borderColor,
  iconColor = "#D1D5DB",

  variant = "default",
}: Props) {
  const variants = {
    default: {
      bg: active ? "#2E3038" : "transparent",
      border: "#2E3038",
    },
    danger: {
      bg: "#C74E5B",
      border: "#270005",
    },
    success: {
      bg: "#34C759",
      border: "#34C759",
    },
  };

  const current = variants[variant];

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
          ></div>

          <button className={styles.options} onClick={onOptionsClick}>
            <span className={styles.dots}></span>
          </button>
        </>
      )}
    </div>
  );
}