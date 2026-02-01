import styles from "./RoomBoard.module.css";
import { Icon } from "../../assets/icons/Icon";
import { useState } from "react";

export default function RoomBoard() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  return (
    <div className={styles.roomBoardContainer}>
      <div className={styles.roomBoardContent}>
        <button 
          onClick={() => setIsMicOn(!isMicOn)} 
          className={styles.roomBoardButton}
        >
          <Icon name={isMicOn ? "micOn" : "micOff"} />
        </button>
        
        <button 
          onClick={() => setIsCameraOn(!isCameraOn)} 
          className={styles.roomBoardButton}
        >
          <Icon name={isCameraOn ? "cameraOn" : "cameraOff"} />
        </button>
        
        <button className={styles.roomBoardButton}>
          <Icon name="screenShare" />
        </button>
        
        <button className={styles.roomBoardButton}>
          <Icon name="hangUp" />
        </button>
      </div>
    </div>
  );
}