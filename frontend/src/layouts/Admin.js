import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import BackgroundVideo from "components/BackgroundVideo/BackgroundVideo.js";
import CompanionShell from "components/companion/CompanionShell";
import { CompanionProvider } from "companion/CompanionProvider";
import routes from "routes.js";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <CompanionProvider>
      <BackgroundVideo />
      <div 
        className="main-content" 
        ref={mainContent} 
        style={{ minHeight: "100vh", padding: "2rem" }}
      >
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
      </div>
      <CompanionShell />
    </CompanionProvider>
  );
};

export default Admin;
