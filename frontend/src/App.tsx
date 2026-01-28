import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import IntlProviderWrapper from "./providers/IntlProviderWrapper";
import { LocaleProvider } from "./i18n/LocaleContext";
import { QueryProvider } from "./providers/QueryProvider";

import LoadingSpinner from "./components/ui/loading/LoadingSpinner";
import DefaultLayout from "./layout/default/Default";
import SecureLayout from "./layout/auth/Auth";
import MinimalLayout from "./layout/minimal/Minimal";

const AuthPage = lazy(() => import("./views/auth/AuthPage"))
const HomePage = lazy(() => import("./views/home/HomePage"));
const AboutPage = lazy(() => import("./views/about/AboutPage"));
const PricingPage = lazy(() => import("./views/pricing/PricingPage"));
const NotFound = lazy(() => import("./views/notfound/Notfound"));

function App() {
  return (
    <QueryProvider>
      <LocaleProvider>
        <IntlProviderWrapper>
          <BrowserRouter>
            <Suspense
              fallback={
                <LoadingSpinner />
              }
            >
              <Routes>
                <Route element={<MinimalLayout />}>
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Route>

                <Route element={<DefaultLayout />}>
                  <Route path="/" element={<HomePage />} />
                </Route>

                <Route element={<SecureLayout />}>
                  <Route path="/auth" element={<AuthPage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </IntlProviderWrapper>
      </LocaleProvider>
    </QueryProvider>
  );
}

export default App;
