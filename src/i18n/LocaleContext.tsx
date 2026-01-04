import { createContext, useContext } from "react";
import { Locale } from "./locales";

type LocaleContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

export const LocaleContext = createContext<LocaleContextType | null>(null);

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
};
