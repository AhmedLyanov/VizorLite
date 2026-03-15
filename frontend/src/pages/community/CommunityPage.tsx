import styles from "./Community.module.css";
import Post from "../../shared/ui/post/Post";

export default function CommunityPage() {
  return (
    <div className={styles.containerContent}>
      <Post />
    </div>
  );
}
