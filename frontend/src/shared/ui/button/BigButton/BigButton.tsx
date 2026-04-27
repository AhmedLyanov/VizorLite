import styles from "./BigButton.module.css"

type Props = {
    title: string;
    image: string;
    active?: boolean;
    onClick?: () => void;
}

export default function BigButton({title, image, active, onClick}: Props) {
  return (
    <div className={styles.containerBigbutton}>
        <button 
            className={`${styles.BigButton} ${!active && styles.disabled}`}
            onClick={active ? onClick : undefined}
            disabled={!active}
        >
            <img src={image} className={styles.BigButton_image} title={title} width={100}/>
            <span className={styles.BigButton_text}>{title}</span>
        </button>
    </div>
  )
}