import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./JoinMeeting.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function JoinMeetingModal({ isOpen, onClose }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const extractRoomId = (input: string) => {
    const match = input.match(/room\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input.trim();
  };

  const handleJoin = () => {
    const roomId = extractRoomId(value);

    if (!roomId) {
      setError("Введите ссылку или ID комнаты");
      return;
    }

    navigate(`/room/${roomId}`);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Присоединиться к встрече</h2>

        <input
          type="text"
          placeholder="Вставьте ссылку или ID комнаты"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          className={styles.input}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button onClick={onClose}>Отмена</button>
          <button onClick={handleJoin}>Подключиться</button>
        </div>
      </div>
    </div>
  );
}
