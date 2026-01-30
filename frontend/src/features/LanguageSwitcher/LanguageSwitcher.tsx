import { useRef } from "react";
import { useIntl } from "react-intl";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useLocaleStore } from "../../entities/locale";
import { Icon } from "../../shared/icons/Icon";
import styles from "./LanguageSwitcher.module.css";

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({
  className = "",
}: LanguageSwitcherProps) {
  const intl = useIntl();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    locale,
    setLocale,
    getAvailableLocales,
  } = useLocaleStore();

  const languages = getAvailableLocales();

  const handleLanguageChange = (langCode: string) => {
    setLocale(langCode as any);
  };

  const items: MenuProps['items'] = languages.map((lang) => ({
    key: lang.code,
    label: (
      <div className={styles.langItem}>
        <span className={styles.flag}>{lang.flag}</span>
        <span className={styles.langName}>{lang.name}</span>
        {locale === lang.code && (
          <span className={styles.checkmark}>✓</span>
        )}
      </div>
    ),
    onClick: () => handleLanguageChange(lang.code),
    className: locale === lang.code ? styles.active : "",
  }));

  return (
    <div
      ref={wrapperRef}
      className={`${styles.langWrapper} ${className}`}
      role="region"
      aria-label="Language selector"
    >
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        placement="bottomLeft"
        overlayClassName={styles.antdDropdown}
        destroyPopupOnHide
      >
        <button
          className={styles.langToggleButton}
          aria-label={intl.formatMessage({ id: "home.bottom.translate" })}
          aria-haspopup="true"
        >
          <Icon name="translate" size={20} />
          <span>{intl.formatMessage({ id: "home.bottom.translate" })}</span>
        </button>
      </Dropdown>
    </div>
  );
}