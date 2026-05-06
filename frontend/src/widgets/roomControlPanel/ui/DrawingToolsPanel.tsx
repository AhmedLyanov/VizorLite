import React from 'react';

import { useDeviceStore } from '@/entities/device';

import styles from './DrawingToolsPanel.module.css';

const colors = [
  { name: 'Чёрный', value: '#000000' },
  { name: 'Красный', value: '#FF0000' },
  { name: 'Зелёный', value: '#00FF00' },
  { name: 'Синий', value: '#0000FF' },
  { name: 'Жёлтый', value: '#FFFF00' },
  { name: 'Оранжевый', value: '#FFA500' },
  { name: 'Розовый', value: '#FF69B4' },
  { name: 'Фиолетовый', value: '#800080' },
];

export const DrawingToolsPanel: React.FC = () => {
  const { drawingColor, setDrawingColor, drawingSize, setDrawingSize } = useDeviceStore();

  return (
    <div className={styles.panel}>
      <div className={styles.colors}>
        {colors.map((color) => (
          <button
            key={color.value}
            className={`${styles.colorBtn} ${drawingColor === color.value ? styles.active : ''}`}
            style={{ backgroundColor: color.value }}
            onClick={() => setDrawingColor(color.value)}
            title={color.name}
          />
        ))}
      </div>
      <div className={styles.sizeControl}>
        <span>Размер:</span>
        <input
          type="range"
          min={1}
          max={20}
          value={drawingSize}
          onChange={(e) => setDrawingSize(Number(e.target.value))}
        />
        <span>{drawingSize}px</span>
      </div>
    </div>
  );
};