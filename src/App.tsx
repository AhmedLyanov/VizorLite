import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layout/default/Default";
import MinimalLayout from "./layout/minimal/Minimal";
import Home from "./views/home/HomePage";
import Pricing from "./views/pricing/Pricing";
import NotFound from "./views/notfound/Notfound";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MinimalLayout />}>
          <Route path="/pricing" element={<Pricing />} />
        </Route>

        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
