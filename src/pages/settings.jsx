import Sidebar from "../components/Sidebar";

function Settings({ setPage }) {
  return (
    <>
      <Sidebar setPage={setPage} />

      <div
        style={{
          marginLeft: "250px",
          padding: "30px",
          background: "#f4f6f9",
          minHeight: "100vh",
        }}
      >
        <h1>⚙️ Settings</h1>

        <p
          style={{
            color: "#64748b",
            fontSize: "18px",
          }}
        >
          Manage your Enterprise AI platform settings.
        </p>

        {/* Profile Settings */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginTop: "30px",
          }}
        >
          <h2>👤 Profile</h2>

          <p>
            <strong>Name:</strong> Project Manager
          </p>

          <p>
            <strong>Role:</strong> Administrator
          </p>

          <p>
            <strong>Email:</strong> manager@enterpriseai.com
          </p>
        </div>

        {/* Application Settings */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginTop: "25px",
          }}
        >
          <h2>🖥️ Application Settings</h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "15px 0",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <span>AI Decision Automation</span>

            <strong style={{ color: "green" }}>
              Enabled
            </strong>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "15px 0",
            }}
          >
            <span>Workflow Risk Analysis</span>

            <strong style={{ color: "green" }}>
              Enabled
            </strong>
          </div>
        </div>

        {/* Notification Settings */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginTop: "25px",
          }}
        >
          <h2>🔔 Notifications</h2>

          <p>
            High-risk workflow alerts
          </p>

          <button
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Notifications Enabled
          </button>
        </div>

        {/* System Information */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginTop: "25px",
          }}
        >
          <h2>ℹ️ System Information</h2>

          <p>
            <strong>Platform:</strong> Enterprise Workflow Platform
          </p>

          <p>
            <strong>Decision Engine:</strong> Python FastAPI
          </p>

          <p>
            <strong>Frontend:</strong> React + Vite
          </p>

          <p>
            <strong>System Status:</strong>{" "}
            <span style={{ color: "green", fontWeight: "bold" }}>
              Operational
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Settings;