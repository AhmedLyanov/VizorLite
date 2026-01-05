import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LOCALES, Locale, messages } from "../i18n";

interface LocaleStore {
  locale: Locale;
  isChanging: boolean;

  isLanguageSwitcherOpen: boolean;

  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  getCurrentMessages: () => (typeof messages)[keyof typeof messages];
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

      getAvailableLocales: () => [
        { code: LOCALES.RUSSIAN, name: "Русский", flag: "🇷🇺" },
        { code: LOCALES.ENGLISH, name: "English", flag: "🇺🇸" },
        { code: LOCALES.JAPANESE, name: "日本語", flag: "🇯🇵" },
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
  };
};
