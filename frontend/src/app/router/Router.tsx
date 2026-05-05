import { BrowserRouter, useRoutes } from "react-router-dom";
import { Suspense } from "react";

import LoadingSpinner from "@/shared/ui/loading/LoadingSpinner";

import { routes } from "./routes";
function AppRoutes() {
  return useRoutes(routes);
}

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}
