import React, { useState, useEffect } from 'react';
import { Popover, Tabs, Button, Switch, Space, Divider, Typography } from 'antd';
import { TranslationOutlined, MoonOutlined, QuestionCircleOutlined, PictureOutlined } from '@ant-design/icons';

import { BackgroundSection } from './sections/BackgroundSection';
import { useSettingsStore } from '@/entities/user/useSettingsStore';
import { useAuth } from '@/entities/user/AuthContext';

import styles from '../Aside.module.css';

const { Text } = Typography;

export const SettingsPopover: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { loadSettings, isLoading } = useSettingsStore();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (open && isAuthenticated) {
      loadSettings();
    }
  }, [open, isAuthenticated]);

  const content = (
    <div style={{ width: 360 }}>
      <Tabs
        items={[
          {
            key: 'general',
            label: 'Основные',
            children: (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div className={styles.settingsItem}>
                  <Space>
                    <MoonOutlined />
                    <Text>Темная тема</Text>
                  </Space>
                  <Switch size="small" />
                </div>

                <Divider style={{ margin: 0 }} />

                <div className={styles.settingsItem}>
                  <Space>
                    <TranslationOutlined />
                    <Text>Язык</Text>
                  </Space>
                  <select className={styles.languageSelect}>
                    <option value="en">English</option>
                    <option value="ru">Русский</option>
                  </select>
                </div>

                <Divider style={{ margin: 0 }} />

                <div className={styles.settingsItem}>
                  <Space>
                    <QuestionCircleOutlined />
                    <Text>О приложении</Text>
                  </Space>
                  <Button type="link" size="small" style={{ padding: 0 }}>
                    Подробнее
                  </Button>
                </div>
              </Space>
            )
          },
          {
            key: 'background',
            label: (
              <span>
                <PictureOutlined /> Фон
              </span>
            ),
            children: <BackgroundSection />
          }
        ]}
      />
      
      <Divider style={{ margin: '12px 0 0 0' }} />
      <div className={styles.settingsFooter}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          VizorLite v1.0.0
        </Text>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      title="Настройки"
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="rightBottom"
      overlayClassName={styles.settingsPopover}
      arrow={false}
    >
      {children}
    </Popover>
  );
};