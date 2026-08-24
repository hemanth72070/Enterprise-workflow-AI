import { useState } from "react";

import Sidebar from "./components/Sidebar";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import AIAssistant from "./pages/AIAssistant";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("access_token"))
  );

  const [page, setPage] = useState(
    localStorage.getItem("access_token")
      ? "dashboard"
      : "login"
  );

  const handleLogout = () => {
    console.log("Logging out...");

    // Remove authentication information
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    // Clear login state
    setIsLoggedIn(false);
    setPage("login");

    // Reload application so no old authenticated state remains
    window.location.href = "/";
  };

  // Show Login page when user is not authenticated
  if (!isLoggedIn) {
    return (
      <Login
        setIsLoggedIn={setIsLoggedIn}
        setPage={setPage}
      />
    );
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard setPage={setPage} />;

      case "projects":
        return <Projects setPage={setPage} />;

      case "tasks":
        return <Tasks setPage={setPage} />;

      case "assistant":
        return <AIAssistant setPage={setPage} />;

      case "reports":
        return <Reports setPage={setPage} />;

      case "settings":
        return <Settings setPage={setPage} />;

      default:
        return <Dashboard setPage={setPage} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Sidebar
        page={page}
        setPage={setPage}
        handleLogout={handleLogout}
      />

      <div>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;