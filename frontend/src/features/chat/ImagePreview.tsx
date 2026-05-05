import { useEffect } from 'react';
import { useIntl } from 'react-intl';

import downloadIcon from '@/shared/assets/download.svg';

import styles from './ImagePreview.module.css';


interface ImagePreviewModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
  onDownload: (url: string, fileName: string) => void;
}

export default function ImagePreviewModal({
  isOpen,
  imageUrl,
  onClose,
  onDownload
}: ImagePreviewModalProps) {
  const intl = useIntl();
  
  const handleDownload = () => {
    if (imageUrl) {
      const fileName = imageUrl.split('/').pop() || 'image';
      const relativePath = imageUrl.replace(import.meta.env.VITE_API_URL, '');
      onDownload(relativePath, fileName);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        
        <div className={styles.imageWrapper}>
          <img
            src={imageUrl}
            alt="Preview"
            className={styles.previewImage}
            onClick={onClose}
          />
        </div>
        
        <div className={styles.previewActions}>
          <button
            className={styles.previewDownloadButton}
            onClick={handleDownload}
          >
            <img src={downloadIcon} alt={intl.formatMessage({ id: "chat.file.download" })} />
            <span>{intl.formatMessage({ id: "chat.file.download" })}</span>
          </button>
        </div>
      </div>
    </div>
  );
}