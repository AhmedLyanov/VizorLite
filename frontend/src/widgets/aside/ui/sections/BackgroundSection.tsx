import React from 'react';
import { Upload, Button, Radio, message, Divider } from 'antd';
import { PictureOutlined, DeleteOutlined } from '@ant-design/icons';

import { useSettingsStore } from '@/entities/user/useSettingsStore';

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
  const background = settings.background;

  const handleCustomUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      // 👇 ИСПРАВЛЕНИЕ ТУТ - проверяем тип
      const result = e.target?.result;
      if (typeof result === 'string') {
        await updateSection('background', { image: result });
        message.success('Фон установлен');
      }
    };
    reader.readAsDataURL(file);
    return false;
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ marginBottom: 12, fontWeight: 500, fontSize: 14 }}>Готовые фоны</div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: 10,
          maxHeight: 300,
          overflowY: 'auto',
          paddingRight: 4
        }}>
          {PRESET_BACKGROUNDS.map(bg => (
            <div
              key={bg.id}
              onClick={() => handlePresetSelect(bg.url)}
              style={{
                height: 80,
                background: `url(${bg.url}) center/cover`,
                borderRadius: 8,
                cursor: 'pointer',
                position: 'relative',
                border: background.image === bg.url ? '2px solid #1677ff' : '1px solid #d9d9d9',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                position: 'absolute',
                bottom: 6,
                left: 8,
                color: 'white',
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                fontSize: 11,
                fontWeight: 500,
                background: 'rgba(0,0,0,0.4)',
                padding: '2px 6px',
                borderRadius: 4,
                backdropFilter: 'blur(4px)',
              }}>
                {bg.name}
              </div>
              {background.image === bg.url && (
                <div style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  background: '#1677ff',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 12,
                }}>
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      <div>
        <div style={{ marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Свой фон</div>
        <Upload accept="image/*" showUploadList={false} beforeUpload={handleCustomUpload}>
          <Button icon={<PictureOutlined />} block loading={isLoading}>
            Загрузить изображение
          </Button>
        </Upload>
      </div>

      {background.image && (
        <>
          <Divider style={{ margin: 0 }} />
          <div>
            <div style={{ marginBottom: 12, fontWeight: 500, fontSize: 14 }}>Настройки отображения</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ marginBottom: 8, fontSize: 13, color: '#666' }}>Размер</div>
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
                <div style={{ marginBottom: 8, fontSize: 13, color: '#666' }}>Прокрутка</div>
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