import { useAuth } from '../../../entities/user/AuthContext';
import LoadingSpinner from '../loading/LoadingSpinner';
import styles from './Profile.module.css';
import { useState, useRef } from 'react';
import { profileApi } from '../../../shared/api/profileApi';

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

export default function Profile() {
  const { user, isLoading, logout, updateUserAvatar } = useAuth();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (event: ChangeEvent) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Файл слишком большой. Максимальный размер 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Поддерживаются только изображения (JPEG, PNG, GIF, WEBP)');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await profileApi.uploadAvatar(formData);

      if (response.data?.avatarUrl) {
        updateUserAvatar(response.data.avatarUrl);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: unknown) {
      const apiError = error as ApiError;
      setUploadError(apiError.response?.data?.message || 'Ошибка при загрузке аватара');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить аватар?')) {
      return;
    }

    setIsUploading(true);

    try {
      await profileApi.deleteAvatar();
      updateUserAvatar('');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: unknown) {
      const apiError = error as ApiError;
      setUploadError(apiError.response?.data?.message || 'Ошибка при удалении аватара');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const parent = target.parentElement;

    if (parent && user) {
      parent.innerHTML = user.username?.charAt(0).toUpperCase() || '?';
    }
  };

  const getAvatarUrl = (avatar: string | null | undefined) => {
    if (!avatar) return '';
    return avatar;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className={styles.profileEmpty}>
        <p>No user data available</p>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          <div className={styles.profileAvatar}>
            {user.avatar ? (
              <img
                src={getAvatarUrl(user.avatar)}
                alt={user.username}
                className={styles.avatarImage}
                onError={handleImageError}
              />
            ) : (
              user.username?.charAt(0).toUpperCase() || '?'
            )}

            {isUploading && (
              <div className={styles.avatarOverlay}>
                <LoadingSpinner size="small" />
              </div>
            )}
          </div>

          <div className={styles.avatarActions}>
            <label className={styles.avatarUploadLabel}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleAvatarUpload}
                disabled={isUploading}
                className={styles.avatarInput}
                key={user.avatar ? 'has-avatar' : 'no-avatar'}
              />
              <span className={styles.avatarUploadIcon} title="Загрузить аватар">
                📷
              </span>
            </label>

            {user.avatar && (
              <button
                onClick={handleDeleteAvatar}
                className={styles.avatarDeleteButton}
                disabled={isUploading}
                title="Удалить аватар"
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        <div className={styles.profileInfo}>
          <h3 className={styles.profileUsername}>{user.username}</h3>
          <p className={styles.profileEmail}>{user.email}</p>
        </div>
      </div>

      {uploadError && (
        <div className={styles.errorMessage}>
          {uploadError}
        </div>
      )}

      <div className={styles.profileDetails}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>User ID:</span>
          <span className={styles.detailValue}>{user.id}</span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Joined:</span>
          <span className={styles.detailValue}>
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : 'N/A'}
          </span>
        </div>
      </div>

      <button onClick={logout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}