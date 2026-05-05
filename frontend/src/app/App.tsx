import { LocaleProvider } from "@/shared/locale/i18n/LocaleContext";

import IntlProviderWrapper from "./providers/IntlProviderWrapper";
import { QueryProvider } from "./providers/QueryProvider";
import { AuthProvider } from "./providers/AuthProvider";
import Router from "./router/Router";

function App() {
  return (
    <QueryProvider>
      <LocaleProvider>
        <IntlProviderWrapper>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </IntlProviderWrapper>
      </LocaleProvider>
    </QueryProvider>
  );
}

export default App;
