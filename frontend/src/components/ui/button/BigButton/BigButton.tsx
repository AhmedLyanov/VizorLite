import styles from "./BigButton.module.css"

type Props = {
    title: string;
    image: string;
}

export default function BigButton({title, image}: Props) {
  return (
    <div className={styles.containerBigbutton}>
        <button className={styles.BigButton}>
            <img src={image} className={styles.BigButton_image} title={title} width={100}/>
            <span className={styles.BigButton_text}>{title}</span>
        </button>
    </div>
  )
}