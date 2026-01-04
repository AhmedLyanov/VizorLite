import { Suspense, lazy, useState } from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LOCALES, messages, Locale } from "./i18n";
import { LocaleContext } from "./i18n/LocaleContext";

import DefaultLayout from "./layout/default/Default";
import MinimalLayout from "./layout/minimal/Minimal";

const HomePage = lazy(() => import("./views/home/HomePage"));
const AboutPage = lazy(() => import("./views/about/AboutPage"));
const PricingPage = lazy(() => import("./views/pricing/PricingPage"));
const NotFound = lazy(() => import("./views/notfound/Notfound"));

function App() {
  const [locale, setLocale] = useState<Locale>(LOCALES.ENGLISH);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>

    <IntlProvider
      locale={locale}
      messages={messages[locale]}
      defaultLocale={LOCALES.ENGLISH}
    >
      <BrowserRouter>
        <Suspense fallback={<div>Загрузка...</div>}>
          <Routes>
            <Route element={<MinimalLayout />}>
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>

            <Route element={<DefaultLayout />}>
              <Route path="/" element={<HomePage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </IntlProvider>
    </LocaleContext.Provider>
  );
}

export default App;
