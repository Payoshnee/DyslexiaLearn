import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import "assets/css/child-theme.css";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import Home from "views/Home.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      {/* Route to Home Page */}
      <Route path="/" element={<Home />} />

      {/* Routes for Admin and Auth layouts */}
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/auth/*" element={<AuthLayout />} />

      {/* Redirect unmatched routes to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
