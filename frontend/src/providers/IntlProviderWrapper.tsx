import { IntlProvider } from "react-intl";
import { useLocaleStore } from "../store/uselocaleStore";
import { LOCALES, messages } from "../i18n";

interface IntlProviderWrapperProps {
  children: React.ReactNode;
}

export default function IntlProviderWrapper({ children }: IntlProviderWrapperProps) {
  const locale = useLocaleStore(state => state.locale);
  
  return (
    <IntlProvider
      locale={locale}
      messages={messages[locale]}
      defaultLocale={LOCALES.ENGLISH}
    >
      {children}
    </IntlProvider>
  );
}