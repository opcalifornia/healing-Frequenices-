import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import "@fontsource-variable/figtree";
import "./styles/global.css";
import App from "./App";

// Hash routing only for the single-file artifact preview build.
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </Router>
  </React.StrictMode>,
);
