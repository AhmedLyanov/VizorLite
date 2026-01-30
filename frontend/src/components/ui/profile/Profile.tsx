import { useAuth } from '../../../contexts/AuthContext';
import LoadingSpinner from '../loading/LoadingSpinner';
import styles from './Profile.module.css';

export default function Profile() {
  const { profile, isLoading, logout } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!profile) {
    return (
      <div className={styles.profileEmpty}>
        <p>No user data available</p>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileAvatar}>
          {profile.user.username.charAt(0).toUpperCase()}
        </div>
        <div className={styles.profileInfo}>
          <h3 className={styles.profileUsername}>{profile.user.username}</h3>
          <p className={styles.profileEmail}>{profile.user.email}</p>
        </div>
      </div>
      
      <div className={styles.profileDetails}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>User ID:</span>
          <span className={styles.detailValue}>{profile.user._id}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Joined:</span>
          <span className={styles.detailValue}>
            {new Date(profile.user.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Account created:</span>
          <span className={styles.detailValue}>
            {new Date(profile.user.createdAt).toLocaleDateString('ru-RU')}
          </span>
        </div>
      </div>
      
      <button onClick={logout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}