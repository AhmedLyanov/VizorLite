import { create } from "zustand";
import { persist } from "zustand/middleware";

import { LOCALES, messages, type MessageKey } from "./i18n";
import type { Locale } from "./i18n";
import { getCountryByCode, COUNTRIES, type CountryOption } from "../../shared/constants/phoneFormats";

interface LocaleStore {
  locale: Locale;
  selectedCountry: CountryOption | null;
  isChanging: boolean;
  isLanguageSwitcherOpen: boolean;

  setLocale: (locale: Locale) => void;
  setCountry: (countryCode: string) => void;
  toggleLocale: () => void;
  getCurrentMessages: () => typeof messages[keyof typeof messages];
  getMessage: (key: MessageKey) => string;
  getAvailableLocales: () => Array<{
    code: Locale;
    name: string;
    flag: string;
  }>;

  toggleLanguageSwitcher: () => void;
  openLanguageSwitcher: () => void;
  closeLanguageSwitcher: () => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set, get) => ({
      locale: LOCALES.ENGLISH,
      selectedCountry: COUNTRIES[0], // Default to US
      isChanging: false,
      isLanguageSwitcherOpen: false,

      setLocale: (locale) => {
        set({
          locale,
          isChanging: true,
          isLanguageSwitcherOpen: false,
        });

        setTimeout(() => set({ isChanging: false }), 300);
      },

      setCountry: (countryCode) => {
        const country = getCountryByCode(countryCode);
        if (country) {
          set({
            selectedCountry: country,
            locale: country.locale as Locale,
            isChanging: true,
            isLanguageSwitcherOpen: false,
          });

          setTimeout(() => set({ isChanging: false }), 300);
        }
      },

      toggleLocale: () => {
        const current = get().locale;
        const newLocale =
          current === LOCALES.ENGLISH ? LOCALES.RUSSIAN : LOCALES.ENGLISH;
        get().setLocale(newLocale);
      },

      toggleLanguageSwitcher: () => {
        set((state) => ({
          isLanguageSwitcherOpen: !state.isLanguageSwitcherOpen,
        }));
      },

      openLanguageSwitcher: () => {
        set({ isLanguageSwitcherOpen: true });
      },

      closeLanguageSwitcher: () => {
        set({ isLanguageSwitcherOpen: false });
      },

      getCurrentMessages: () => {
        return messages[get().locale];
      },

      getMessage: (key: MessageKey) => {
        const localeMessages = messages[get().locale];
        return localeMessages[key] || key; 
      },

      getAvailableLocales: () => [
        { code: LOCALES.RUSSIAN, name: "Русский", flag: "🇷🇺" },
        { code: LOCALES.ENGLISH, name: "English", flag: "🇺🇸" },
        { code: LOCALES.GERMAN, name: "Deutsch", flag: "🇩🇪" },
        { code: LOCALES.JAPANESE, name: "日本語", flag: "🇯🇵" },
        { code: LOCALES.CHINESE, name: "中文", flag: "🇨🇳" },
        { code: LOCALES.FRENCH, name: "Français", flag: "🇫🇷" },
        { code: LOCALES.ARABIC, name: "العربية", flag: "🇸🇦" },
      ],
    }),
    {
      name: "vizorlite-locale",
      partialize: (state) => ({
        locale: state.locale,
      }),
    }
  )
);

export const useLocale = () => {
  const { locale, setLocale, isChanging } = useLocaleStore();
  const currentMessages = useLocaleStore((state) => state.getCurrentMessages());

  return {
    locale,
    setLocale,
    isChanging,
    messages: currentMessages,
    getMessage: useLocaleStore((state) => state.getMessage),
  };
};