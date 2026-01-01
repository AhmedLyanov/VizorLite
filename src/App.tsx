import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layout/default/default";
import Home from "./views/home/HomePage";
import NotFound from "./views/notfound/Notfound"
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout/>}>
            <Route index element={<Home />}/>
        </Route>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
