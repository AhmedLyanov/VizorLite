import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'small' | 'default' | 'large';
}

export default function LoadingSpinner({ 
  fullScreen = true, 
  size = 'large' 
}: LoadingSpinnerProps) {
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
  
  const spinner = (
    <div className={styles.spinnerContainer}>
      <Spin indicator={antIcon} size={size} />
    </div>
  );

  if (fullScreen) {
    return <div className={styles.fullScreen}>{spinner}</div>;
  }

  return spinner;
}