import styles from "./BigButton.module.css"

type Props = {
    title: string;
    image: string;
    onClick?:() => void;
}

export default function BigButton({title, image, onClick}: Props) {
  return (
    <div className={styles.containerBigbutton} >
        <button className={styles.BigButton} onClick={onClick}>
            <img src={image} className={styles.BigButton_image} title={title} width={100}/>
            <span className={styles.BigButton_text}>{title}</span>
        </button>
    </div>
  )
}