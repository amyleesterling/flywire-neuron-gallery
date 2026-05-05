import { BrowserRouter, Routes, Route } from "react-router-dom";
import FlyWireGallery from "./pages/FlyWireGallery";
import FlyWireMedia from "./pages/FlyWireMedia";

// Vite's BASE_URL is "/" in dev and "/flywire-neuron-gallery/" in production.
// React Router wants the basename WITHOUT a trailing slash.
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <Routes>
        <Route path="/" element={<FlyWireGallery />} />
        <Route path="/media" element={<FlyWireMedia />} />
      </Routes>
    </BrowserRouter>
  );
}
