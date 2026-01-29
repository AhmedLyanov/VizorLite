import styles from './Profile.module.css';

interface ProfileProps {
    user: {
        username: string;
        email: string;
        memberSince: string;
        meetingsCount: number;
        totalTime: number;
        lastActive: string;
        userId?: string;
    };
    onEditProfile: () => void;
    onLogout: () => void;
    onSettings: () => void;
}

export default function Profile({ 
    user, 
    onEditProfile, 
    onLogout, 
    onSettings 
}: ProfileProps) {
    
    // Генерация инициалов для аватара
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };
    
    // Форматирование времени
    const formatTime = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes} мин`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 
            ? `${hours}ч ${remainingMinutes}мин` 
            : `${hours}ч`;
    };
    
    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                {/* Шапка профиля */}
                <div className={styles.profileHeader}>
                    <div className={styles.profileAvatar}>
                        <span className={styles.avatarPlaceholder}>
                            {getInitials(user.username)}
                        </span>
                    </div>
                    
                    <div className={styles.profileInfo}>
                        <h2 className={styles.profileUsername}>
                            {user.username}
                        </h2>
                        <p className={styles.profileEmail}>
                            {user.email}
                        </p>
                        <div className={styles.profileStatus}>
                            <span className={styles.statusDot}></span>
                            <span>Online</span>
                        </div>
                    </div>
                </div>
                
                {/* Статистика */}
                <div className={styles.profileStats}>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>
                            {user.meetingsCount}
                        </div>
                        <div className={styles.statLabel}>
                            Встреч
                        </div>
                    </div>
                    
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>
                            {formatTime(user.totalTime)}
                        </div>
                        <div className={styles.statLabel}>
                            Время
                        </div>
                    </div>
                    
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>
                            {user.meetingsCount > 0 ? "⭐" : "—"}
                        </div>
                        <div className={styles.statLabel}>
                            Рейтинг
                        </div>
                    </div>
                </div>
                
                {/* Детали профиля */}
                <div className={styles.profileDetails}>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                            Участник с:
                        </span>
                        <span className={styles.detailValue}>
                            {user.memberSince}
                        </span>
                    </div>
                    
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                            Последняя активность:
                        </span>
                        <span className={styles.detailValue}>
                            {user.lastActive}
                        </span>
                    </div>
                    
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                            ID пользователя:
                        </span>
                        <span className={styles.detailValue}>
                            {user.userId || '#1234'}
                        </span>
                    </div>
                </div>
                
                {/* Кнопки действий */}
                <div className={styles.profileActions}>
                    <button 
                        className={`${styles.profileButton} ${styles.profileButtonPrimary}`}
                        onClick={onEditProfile}
                    >
                        ✏️ Редактировать профиль
                    </button>
                    
                    <button 
                        className={`${styles.profileButton} ${styles.profileButtonSecondary}`}
                        onClick={onSettings}
                    >
                        ⚙️ Настройки
                    </button>
                    
                    <button 
                        className={`${styles.profileButton} ${styles.profileButtonDanger}`}
                        onClick={onLogout}
                    >
                        🚪 Выйти
                    </button>
                </div>
            </div>
        </div>
    );
}