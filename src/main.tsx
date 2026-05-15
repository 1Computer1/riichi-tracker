import "./index.css";

import { enableMapSet } from "immer";
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import { dexieRepository } from "./data/db";
import { updateTheme } from "./lib/util";
import Calculator from "./pages/Calculator";
import Compass from "./pages/Compass";
import Home from "./pages/Home";
import Reference from "./pages/Reference";
import { DbContext } from "./providers/DbProvider";

updateTheme();

registerSW({
  onRegistered(r: ServiceWorkerRegistration | undefined) {
    if (r) {
      void r.update();
    }
  },
});

enableMapSet();

ReactDOM.createRoot(document.getElementById("root")!).render(
  (() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", () => updateTheme());

    return (
      <React.StrictMode>
        <DbContext.Provider value={dexieRepository()}>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/calculator" element={<Calculator />}></Route>
              <Route path="/compass" element={<Compass />}></Route>
              <Route path="/reference" element={<Reference />}></Route>
            </Routes>
          </HashRouter>
        </DbContext.Provider>
      </React.StrictMode>
    );
  })(),
);
