import React from "react";

import styles from "./CustomModal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function CustomModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {title && <h2 className={styles.title}>{title}</h2>}

        <div className={styles.content}>{children}</div>

        {footer && <div className={styles.actions}>{footer}</div>}
      </div>
    </div>
  );
}
