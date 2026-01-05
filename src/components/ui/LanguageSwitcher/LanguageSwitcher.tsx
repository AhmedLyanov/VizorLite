import { useState, useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { useLocaleStore } from "../../../store/uselocaleStore";
import { Icon } from "../../../shared/icons/Icon";
import styles from "./LanguageSwitcher.module.css";

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ 
  className = "" 
}: LanguageSwitcherProps) {
  const intl = useIntl();
  const { locale, setLocale, getAvailableLocales } = useLocaleStore();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const languages = getAvailableLocales();

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
        aria-label={intl.formatMessage({ id: "home.bottom.translate" })}
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
              aria-label={`Choice ${lang.name}`}
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