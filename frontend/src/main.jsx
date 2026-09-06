import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./app/App.jsx";
import { DoodleProvider } from "./companion/DoodleProvider.jsx";
import "./styles/app.css";
import { installBrowserLogging } from "./services/developerLogger.js";

installBrowserLogging();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <DoodleProvider>
        <App />
      </DoodleProvider>
    </BrowserRouter>
  </React.StrictMode>
);
