import { createContext, useContext } from "react";
import type { Locale } from "../i18n/locales";
import { useLocaleStore } from "../store/uselocaleStore";

type LocaleContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};


export const LocaleContext = createContext<LocaleContextType | null>(null);


export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const { locale, setLocale } = useLocaleStore();

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};


export const useLocaleContext = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocaleContext must be used inside LocaleProvider");
  return ctx;
};

export const useLocale = () => {
  return useLocaleStore();
};