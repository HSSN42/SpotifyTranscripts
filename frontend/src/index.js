import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/tailwind.css";
import * as serviceWorker from "./serviceWorker";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

serviceWorker.unregister();
