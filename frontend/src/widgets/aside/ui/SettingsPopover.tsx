import React, { useState } from 'react';
import { Popover, Button, Divider, Switch, Space, Typography } from 'antd';
import {  TranslationOutlined, MoonOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { useLocaleStore } from '@/shared/locale/uselocaleStore';

import styles from '../Aside.module.css';

const { Text } = Typography;

interface SettingsPopoverProps {
  children: React.ReactNode;
}

export const SettingsPopover: React.FC<SettingsPopoverProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { currentLocale, setLocale } = useLocaleStore();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const content = (
    <div className={styles.settingsPopoverContent}>
      <div className={styles.settingsSection}>
        <div className={styles.settingsItem}>
          <Space>
            <MoonOutlined />
            <Text>Темная тема</Text>
          </Space>
          <Switch 
            checked={darkMode} 
            onChange={setDarkMode} 
            size="small"
          />
        </div>

        <Divider style={{ margin: '8px 0' }} />

        <div className={styles.settingsItem}>
          <Space>
            <TranslationOutlined />
            <Text>Язык</Text>
          </Space>
          <select 
            value={currentLocale} 
            onChange={(e) => setLocale(e.target.value as any)}
            className={styles.languageSelect}
          >
            <option value="en-US">English</option>
            <option value="ru-RU">Русский</option>
            <option value="zh-CN">中文</option>
            <option value="fr-FR">Français</option>
            <option value="de-DE">Deutsch</option>
            <option value="ar-SA">العربية</option>
            <option value="jp-JP">日本語</option>
          </select>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        <div className={styles.settingsItem}>
          <Space>
            <QuestionCircleOutlined />
            <Text>О приложении</Text>
          </Space>
          <Button 
            type="link" 
            size="small" 
            onClick={() => window.open('/about', '_blank')}
            style={{ padding: 0 }}
          >
            Подробнее
          </Button>
        </div>
      </div>

      <div className={styles.settingsFooter}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
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
      onOpenChange={handleOpenChange}
      placement="rightBottom"
      overlayClassName={styles.settingsPopover}
      arrow={false}
    >
      {children}
    </Popover>
  );
};