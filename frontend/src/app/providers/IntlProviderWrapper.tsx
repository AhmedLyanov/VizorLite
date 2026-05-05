import { IntlProvider } from "react-intl";

import { useLocaleStore } from "@/shared/locale";
import { LOCALES, messages } from "@/shared/locale/i18n";


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