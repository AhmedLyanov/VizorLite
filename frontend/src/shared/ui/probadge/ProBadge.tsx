import { CrownOutlined } from '@ant-design/icons';

import styles from './ProBadge.module.css';

interface ProBadgeProps {
  text?: string;
  iconSize?: number;
  className?: string;
  size?: 'small' | 'medium';
}

export const ProBadge: React.FC<ProBadgeProps> = ({ 
  text = 'PRO', 
  iconSize = 10,
  className,
  size = 'small'
}) => {
  const badgeClass = size === 'medium' ? styles.badgeMedium : styles.badge;
  
  return (
    <span className={`${badgeClass} ${className || ''}`}>
      <CrownOutlined style={{ fontSize: iconSize }} className={styles.icon} />
      {text}
    </span>
  );
};