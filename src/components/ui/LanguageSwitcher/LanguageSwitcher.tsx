import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { useLocaleStore } from "../../../store/uselocaleStore";
import { Icon } from "../../../shared/icons/Icon";
import styles from "./LanguageSwitcher.module.css";

interface LanguageSwitcherProps {
  className?: string;
  autoCloseOnClickOutside?: boolean;
}

export default function LanguageSwitcher({
  className = "",
  autoCloseOnClickOutside = true,
}: LanguageSwitcherProps) {
  const intl = useIntl();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    locale,
    isLanguageSwitcherOpen,
    setLocale,
    toggleLanguageSwitcher,
    closeLanguageSwitcher,
    getAvailableLocales,
  } = useLocaleStore();

  const languages = getAvailableLocales();

  const handleLanguageChange = (langCode: string) => {
    setLocale(langCode as any);
  };

  const handleToggle = () => {
    toggleLanguageSwitcher();
  };

  useEffect(() => {
    if (!autoCloseOnClickOutside || !isLanguageSwitcherOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        closeLanguageSwitcher();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLanguageSwitcherOpen, autoCloseOnClickOutside, closeLanguageSwitcher]);

  useEffect(() => {
    if (!isLanguageSwitcherOpen) {
      return;
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLanguageSwitcher();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isLanguageSwitcherOpen, closeLanguageSwitcher]);

  return (
    <div
      ref={wrapperRef}
      className={`${styles.langWrapper} ${className}`}
      role="region"
      aria-label="Language selector"
    >
      <button
        className={styles.langToggleButton}
        onClick={handleToggle}
        aria-label={intl.formatMessage({ id: "home.bottom.translate" })}
        aria-expanded={isLanguageSwitcherOpen}
        aria-haspopup="true"
      >
        <Icon name="translate" size={20} />
        <span>{intl.formatMessage({ id: "home.bottom.translate" })}</span>
      </button>

      {isLanguageSwitcherOpen && (
        <div
          className={styles.langDropdown}
          role="menu"
          aria-orientation="vertical"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.langItem} ${
                locale === lang.code ? styles.active : ""
              }`}
              onClick={() => handleLanguageChange(lang.code)}
              aria-label={`Select ${lang.name}`}
              role="menuitem"
              aria-checked={locale === lang.code}
            >
              <span className={styles.flag}>{lang.flag}</span>
              <span className={styles.langName}>{lang.name}</span>
              {locale === lang.code && (
                <span className={styles.checkmark} aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
