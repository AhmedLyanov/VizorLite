import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import IntlProviderWrapper from "./providers/IntlProviderWrapper";
import { LocaleProvider } from "./i18n/LocaleContext";
import { QueryProvider } from "./providers/QueryProvider";
import { AuthProvider } from "./providers/AuthProvider";

import LoadingSpinner from "./components/ui/loading/LoadingSpinner";
import DefaultLayout from "./layout/default/Default";
import SecureLayout from "./layout/auth/Auth";
import MinimalLayout from "./layout/minimal/Minimal";
import { ProtectedRoute } from "./components/ui/protected";

const AuthPage = lazy(() => import("./views/auth/AuthPage"))
const HomePage = lazy(() => import("./views/home/HomePage"));
const ProfilePage = lazy(() => import("./views/profile/ProfilePage"))
const AboutPage = lazy(() => import("./views/about/AboutPage"));
const PricingPage = lazy(() => import("./views/pricing/PricingPage"));
const NotFound = lazy(() => import("./views/notfound/Notfound"));

function App() {
  return (
    <QueryProvider>
      <LocaleProvider>
        <IntlProviderWrapper>
          <AuthProvider>
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
                    <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>} />

                  </Route>

                  <Route element={<SecureLayout />}>
                    <Route path="/auth" element={<AuthPage />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </IntlProviderWrapper>
      </LocaleProvider>
    </QueryProvider>
  );
}

export default App;
