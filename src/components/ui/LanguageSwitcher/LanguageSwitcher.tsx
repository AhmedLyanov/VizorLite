import { useState, useContext, useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { LocaleContext } from "../../../i18n/LocaleContext";
import { LOCALES } from "../../../i18n";
import { Icon } from "../../../shared/icons/Icon";
import styles from "./LanguageSwitcher.module.css";

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ 
  className = "" 
}: LanguageSwitcherProps) {
  const intl = useIntl();
  const { locale, setLocale } = useContext(LocaleContext)!;
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: LOCALES.RUSSIAN, name: "Русский", flag: "🇷🇺" },
    { code: LOCALES.ENGLISH, name: "English", flag: "🇺🇸" },
  ];

  const handleLanguageChange = (langCode: string) => {
    setLocale(langCode as any);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div 
      ref={wrapperRef}
      className={`${styles.langWrapper} ${className}`}
    >
      <button
        className={styles.langToggleButton}
        onClick={handleToggle}
      >
        <Icon name="translate" size={20} />
        <span>{intl.formatMessage({ id: "home.bottom.translate" })}</span>
      </button>

      {isOpen && (
        <div className={styles.langDropdown}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.langItem} ${locale === lang.code ? styles.active : ""}`}
              onClick={() => handleLanguageChange(lang.code)}
              aria-label={`Выбрать ${lang.name}`}
            >
              <span className={styles.flag}>{lang.flag}</span>
              <span className={styles.langName}>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}