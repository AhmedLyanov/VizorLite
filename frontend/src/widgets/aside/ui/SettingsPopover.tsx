import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Popover, Tabs, Button, Switch, Space, Divider, Typography } from 'antd';
import { TranslationOutlined, MoonOutlined, QuestionCircleOutlined, PictureOutlined } from '@ant-design/icons';

import { useSettingsStore } from '@/entities/user/useSettingsStore';
import { useAuth } from '@/entities/user/AuthContext';
import { useLocaleStore } from '@/shared/locale';

import { BackgroundSection } from './sections/BackgroundSection';
import styles from '../Aside.module.css';
import popoverStyles from './SettingsPopover.module.css';

const { Text } = Typography;

export const SettingsPopover: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const intl = useIntl();
  const { loadSettings } = useSettingsStore();
  const { isAuthenticated } = useAuth();
  const { locale, setLocale, getAvailableLocales } = useLocaleStore();
  const languageOptions = getAvailableLocales();

  useEffect(() => {
    if (open && isAuthenticated) {
      loadSettings();
    }
  }, [open, isAuthenticated, loadSettings]);

  const content = (
    <div className={popoverStyles.popoverContent}>
      <Tabs
        items={[
          {
            key: 'general',
            label: intl.formatMessage({ id: 'settings.general' }),
            children: (
              <Space direction="vertical" className={popoverStyles.spaceFullWidth} size="middle">
                <div className={styles.settingsItem}>
                  <Space>
                    <MoonOutlined />
                    <Text>{intl.formatMessage({ id: 'settings.darkTheme' })}</Text>
                  </Space>
                  <Switch size="small" />
                </div>

                <Divider className={popoverStyles.dividerNoMargin} />

                <div className={styles.settingsItem}>
                  <Space>
                    <TranslationOutlined />
                    <Text>{intl.formatMessage({ id: 'settings.language' })}</Text>
                  </Space>
                  <select
                    className={styles.languageSelect}
                    value={locale}
                    onChange={(event) => setLocale(event.target.value as typeof locale)}
                  >
                    {languageOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Divider className={popoverStyles.dividerNoMargin} />

                <div className={styles.settingsItem}>
                  <Space>
                    <QuestionCircleOutlined />
                    <Text>{intl.formatMessage({ id: 'settings.about' })}</Text>
                  </Space>
                  <Button type="link" size="small" className={popoverStyles.buttonLinkNoPadding}>
                    {intl.formatMessage({ id: 'settings.learnMore' })}
                  </Button>
                </div>
              </Space>
            )
          },
          {
            key: 'background',
            label: (
              <span>
                <PictureOutlined /> {intl.formatMessage({ id: 'settings.background' })}
              </span>
            ),
            children: <BackgroundSection />
          }
        ]}
      />

      <Divider className={popoverStyles.dividerFooter} />
      <div className={styles.settingsFooter}>
        <Text type="secondary" className={popoverStyles.footerText}>
          VizorLite v1.0.0
        </Text>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      title={intl.formatMessage({ id: 'settings.title' })}
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