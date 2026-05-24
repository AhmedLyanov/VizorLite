import React, { useRef, useState } from 'react';
import { Button, Radio, message, Divider } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import { ProBadge } from "@/shared/ui/probadge/ProBadge";
import { useSettingsStore } from '@/entities/user/useSettingsStore';
import { usePlan } from '@/entities/user/usePlan';

import styles from './BackgroundSection.module.css';

const PRESET_BACKGROUNDS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920', name: 'Горы' },
  { id: 2, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920', name: 'Лес' },
  { id: 3, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920', name: 'Пляж' },
  { id: 4, url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920', name: 'Космос' },
  { id: 5, url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920', name: 'Абстракция' },
  { id: 6, url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920', name: 'Океан' },
  { id: 7, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920', name: 'Горы снежные' },
  { id: 8, url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920', name: 'Северное сияние' },
  { id: 9, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920', name: 'Туманный лес' },
  { id: 10, url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920', name: 'Поле' },
  { id: 11, url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920', name: 'Сосновый лес' },
  { id: 12, url: 'https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?w=1920', name: 'Звездное небо' },
  { id: 13, url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=1920', name: 'Город' },
  { id: 14, url: 'https://images.unsplash.com/photo-1493246507139-91e8fad1fc71?w=1920', name: 'Мост' },
  { id: 15, url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920', name: 'Озеро' },
  { id: 16, url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1920', name: 'Закат' },
];

export const BackgroundSection: React.FC = () => {
  const { settings, updateSection, isLoading } = useSettingsStore();
  const { isPro } = usePlan();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hoveredAdd, setHoveredAdd] = useState(false);
  const background = settings.background;

  const handleCustomUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        await updateSection('background', { image: result });
        message.success('Фон установлен');
      }
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleAddCustomClick = () => {
    if (!isPro) {
      message.warning('Загрузка своего фона доступна только на PRO плане');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCustomUpload(file);
    }
    e.target.value = '';
  };

  const handlePresetSelect = async (url: string) => {
    await updateSection('background', { image: url });
    message.success('Фон установлен');
  };

  const handleReset = async () => {
    await updateSection('background', { image: null });
    message.success('Фон сброшен');
  };

  return (
    <div className={styles.container}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />

      <div>
        <div className={styles.sectionTitle}>Готовые фоны</div>
        <div className={styles.grid}>
          <div
            onClick={handleAddCustomClick}
            className={`${styles.addButton} ${isPro ? styles.addButtonPro : styles.addButtonFree}`}
            style={{
              background: hoveredAdd && isPro ? '#f0f0f0' : '#f5f5f5',
              borderColor: hoveredAdd && isPro ? '#1677ff' : '#d9d9d9'
            }}
            onMouseEnter={() => setHoveredAdd(true)}
            onMouseLeave={() => setHoveredAdd(false)}
          >
            <PlusOutlined className={isPro ? styles.plusIconPro : styles.plusIconFree} />
            {!isPro && <ProBadge />}
          </div>
          
          {PRESET_BACKGROUNDS.map(bg => (
            <div
              key={bg.id}
              onClick={() => handlePresetSelect(bg.url)}
              className={`${styles.presetItem} ${background.image === bg.url ? styles.presetItemSelected : styles.presetItemDefault}`}
              style={{ background: `url(${bg.url}) center/cover` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className={styles.presetLabel}>
                {bg.name}
              </div>
              {background.image === bg.url && (
                <div className={styles.checkmark}>
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Divider className={styles.divider} />

      {background.image && (
        <>
          <div>
            <div className={styles.settingsGroup}>Настройки отображения</div>
            <div className={styles.settingsContainer}>
              <div>
                <div className={styles.settingLabel}>Размер</div>
                <Radio.Group
                  value={background.size}
                  onChange={(e) => updateSection('background', { size: e.target.value })}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value="cover">Растянуть</Radio.Button>
                  <Radio.Button value="contain">Вписать</Radio.Button>
                  <Radio.Button value="auto">Оригинал</Radio.Button>
                </Radio.Group>
              </div>

              <div>
                <div className={styles.settingLabel}>Прокрутка</div>
                <Radio.Group
                  value={background.attachment}
                  onChange={(e) => updateSection('background', { attachment: e.target.value })}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value="fixed">Фиксированный</Radio.Button>
                  <Radio.Button value="scroll">С прокруткой</Radio.Button>
                </Radio.Group>
              </div>

              <Button
                icon={<DeleteOutlined />}
                onClick={handleReset}
                danger
                size="middle"
                loading={isLoading}
                block
              >
                Сбросить фон
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};