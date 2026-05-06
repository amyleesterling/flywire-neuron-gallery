import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const FlyWireGallery = lazy(() => import("./pages/FlyWireGallery"));
const FlyWireMedia = lazy(() => import("./pages/FlyWireMedia"));

// Vite's BASE_URL is "/" in dev and "/flywire-neuron-gallery/" in production.
// React Router wants the basename WITHOUT a trailing slash.
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, "");

// Suspense fallback: a flat dark backdrop matching the page chrome so there's
// no visual pop while the route chunk + three.js load on first paint.
function RouteFallback() {
  return <div className="fixed inset-0" style={{ background: "rgb(4,6,12)" }} />;
}

export default function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<FlyWireGallery />} />
          <Route path="/media" element={<FlyWireMedia />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
