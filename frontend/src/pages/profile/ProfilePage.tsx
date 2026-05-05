import { Profile } from '@/entities/user';

import styles from './Profile.module.css';

export default function ProfilePage() {
    return (
        <div className={styles.profilePage}>
            <Profile
            />
        </div>
    );
}