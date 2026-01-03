import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layout/default/Default";
import MinimalLayout from "./layout/minimal/Minimal";
import "./App.css";

const HomePage = lazy(() => import("./views/home/HomePage"));
const AboutPage = lazy(() => import("./views/about/AboutPage"));
const PricingPage = lazy(() => import("./views/pricing/PricingPage"));
const NotFound = lazy(() => import("./views/notfound/Notfound"));

function App() {
  return (
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
  );
}

export default App;
