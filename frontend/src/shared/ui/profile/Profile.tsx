import { useAuth } from '../../../entities/user/AuthContext';
import LoadingSpinner from '../loading/LoadingSpinner';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, isLoading, logout } = useAuth(); 

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
        <div className={styles.profileAvatar}>
          {user.username?.charAt(0).toUpperCase() || '?'} 
        </div>
        <div className={styles.profileInfo}>
          <h3 className={styles.profileUsername}>{user.username}</h3>
          <p className={styles.profileEmail}>{user.email}</p>
        </div>
      </div>
      
      <div className={styles.profileDetails}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>User ID:</span>
          <span className={styles.detailValue}>{user.id || user.id}</span> 
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Joined:</span>
          <span className={styles.detailValue}>
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'N/A'}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Account created:</span>
          <span className={styles.detailValue}>
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'N/A'}
          </span>
        </div>
      </div>
      
      <button onClick={logout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}