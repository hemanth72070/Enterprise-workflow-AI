function Sidebar({ setPage, handleLogout }) {
  const buttonStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    border: "none",
    borderRadius: "8px",
    background: "white",
    color: "#2563eb",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  };

  const logoutStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    border: "1px solid white",
    borderRadius: "8px",
    background: "transparent",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <div
      style={{
        width: "230px",
        height: "100vh",
        background: "#2563eb",
        color: "white",
        position: "fixed",
        left: 0,
        top: 0,
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        Enterprise AI
      </h2>

      <hr
        style={{
          margin: "20px 0",
          borderColor: "#ffffff55",
        }}
      />

      <button
        style={buttonStyle}
        onClick={() => setPage("dashboard")}
      >
        🏠 Dashboard
      </button>

      <button
        style={buttonStyle}
        onClick={() => setPage("projects")}
      >
        📁 Projects
      </button>

      <button
        style={buttonStyle}
        onClick={() => setPage("tasks")}
      >
        ✅ Tasks
      </button>

      <button
        style={buttonStyle}
        onClick={() => setPage("assistant")}
      >
        🤖 AI Assistant
      </button>

      <button
        style={buttonStyle}
        onClick={() => setPage("reports")}
      >
        📊 Reports
      </button>

      <button
        style={logoutStyle}
        onClick={handleLogout}
      >
        🚪 Logout
      </button>
    </div>
  );
}

export default Sidebar;