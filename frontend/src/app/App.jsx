import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import NewUserPage from "../pages/NewUserPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import DoodleSelectPage from "../pages/DoodleSelectPage.jsx";
import CompanionStagePage from "../pages/CompanionStagePage.jsx";
import { useDoodle } from "../companion/DoodleContext.js";

function RequireProfile({ children }) {
  const { profile } = useDoodle();
  return profile ? children : <Navigate to="/" replace />;
}

function RequireDoodle({ children }) {
  const { selectedDoodle } = useDoodle();
  return selectedDoodle ? children : <Navigate to="/choose-doodle" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/new-user" element={<NewUserPage />} />
      <Route
        path="/choose-doodle"
        element={
          <RequireProfile>
            <DoodleSelectPage />
          </RequireProfile>
        }
      />
      <Route
        path="/stage"
        element={
          <RequireProfile>
            <RequireDoodle>
              <CompanionStagePage />
            </RequireDoodle>
          </RequireProfile>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
