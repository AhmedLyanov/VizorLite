import React, { useRef, useState } from 'react';
import { Button, Radio, message, Divider } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import { ProBadge } from "@/shared/ui/probadge/ProBadge";
import { useSettingsStore } from '@/entities/user/useSettingsStore';
import { usePlan } from '@/entities/user/usePlan';

import styles from './BackgroundSection.module.css';

const PRESET_BACKGROUNDS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', name: 'Город' },
  { id: 2, url: 'https://images.unsplash.com/photo-1568607689150-17e625c1586e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', name: 'Северное сияние' },
  { id: 3, url: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', name: 'Дорога в лесу' },
  { id: 4, url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', name: 'Космос' },
  { id: 5, url: 'https://4kwallpapers.com/images/walls/thumbs_3t/26437.jpg', name: 'Розовый абстракт' },
  { id: 6, url: 'https://4kwallpapers.com/images/walls/thumbs_3t/26438.jpg', name: 'Коричневый абстракт' },
  { id: 7, url: 'https://4kwallpapers.com/images/walls/thumbs_3t/12264.jpg', name: 'Вид на море' },
  { id: 8, url: 'https://4kwallpapers.com/images/walls/thumbs_3t/25111.jpg', name: 'Аниме' },
  { id: 9, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920', name: 'Туманный лес' },
  { id: 10, url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920', name: 'Поле' },
  { id: 11, url: 'https://4kwallpapers.com/images/walls/thumbs_3t/21159.jpg', name: 'Дубай' },
  { id: 12, url: 'https://4kwallpapers.com/images/walls/thumbs_3t/18646.jpg', name: 'Манхэттен, Нью-Йорк' },
  { id: 13, url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=1920', name: 'Берег' },
  { id: 14, url: 'https://4kwallpapers.com/images/walls/thumbs_3t/26268.jpg', name: 'Аниме 2' },
  { id: 15, url: 'https://4kwallpapers.com/images/walls/thumbs_3t/6596.jpg', name: 'Солдат' },
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