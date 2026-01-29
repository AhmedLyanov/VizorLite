import Profile from '../../components/ui/profile/Profile';
import styles from './Profile.module.css';



//  моковые данные для визуализации профиля
export default function ProfilePage() {
    const userData = {
        username: 'Алексей Петров',
        email: 'alexey@example.com',
        memberSince: '15 января 2024',
        meetingsCount: 42,
        totalTime: 1280, 
        lastActive: 'Сегодня, 14:30',
        userId: '#1234'
    };
    
    const handleEditProfile = () => {
        console.log('Редактировать профиль');
    };
    
    const handleSettings = () => {
        console.log('Настройки');
    };
    
    const handleLogout = () => {
        console.log('Выход');
    };
    
    return (
        <div className={styles.profilePage}>
            <h1 className={styles.pageTitle}>Профиль</h1>
            <Profile 
                user={userData}
                onEditProfile={handleEditProfile}
                onLogout={handleLogout}
                onSettings={handleSettings}
            />
        </div>
    );
}