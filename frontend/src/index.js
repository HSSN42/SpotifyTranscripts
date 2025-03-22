import React from "react";
import ReactDOM from "react-dom";
import "./styles/tailwind.css";
import * as serviceWorker from "./serviceWorker";
import App from "./App.js";
import { HashRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
