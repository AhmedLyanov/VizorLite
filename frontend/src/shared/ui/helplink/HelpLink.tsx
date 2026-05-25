import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';

import questionIcon from '../../assets/question.svg';
import styles from './HelpLink.module.css';

interface HelpLinkProps {
  guideSectionId: string;
  className?: string;
  iconSize?: number;
  showTooltip?: boolean;
  tooltipText?: string;
}

export const HelpLink: React.FC<HelpLinkProps> = ({
  guideSectionId,
  className = '',
  iconSize = 16,
  showTooltip = true,
  tooltipText = 'Learn more'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    sessionStorage.setItem('guideScrollTo', guideSectionId);
    navigate('/guide');
  };

  const button = (
    <button
      className={styles.helpButton}
      onClick={handleClick}
      aria-label={tooltipText}
    >
      <img
        src={questionIcon}
        alt="?"
        style={{ width: iconSize, height: iconSize }}
        className={styles.questionIcon}
      />
    </button>
  );

  return (
    <div className={`${styles.helpLinkWrapper} ${className}`}>
      {showTooltip ? (
        <Tooltip title={tooltipText} placement="top">
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </div>
  );
};