import React from "react";
import ReactDOM from "react-dom";
import "./styles/tailwind.css";
import * as serviceWorker from "./serviceWorker";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
