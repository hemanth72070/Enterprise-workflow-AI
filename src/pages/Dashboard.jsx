import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Dashboard({ setPage }) {
  const [summary, setSummary] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Authentication required. Please login again.");
      setLoading(false);
      return;
    }

    // Get dashboard summary from FastAPI
    fetch("http://localhost:8000/reports/summary", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please login again."
          );
        }

        if (!response.ok) {
          throw new Error("Failed to fetch report data");
        }

        return response.json();
      })
      .then((data) => {
        setSummary(data.summary);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Reports API Error:", error);
        setError(error.message);
        setLoading(false);
      });

    // Get AI decision and risk analysis
    fetch("http://localhost:8000/decisions/scan", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error(
            "Authentication required for decision analysis."
          );
        }

        if (!response.ok) {
          throw new Error(
            "Failed to fetch decision data"
          );
        }

        return response.json();
      })
      .then((data) => {
        setDecisions(data.results);
      })
      .catch((error) => {
        console.error("Decision API Error:", error);
      });
  }, []);

  const cardStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  };

  return (
    <>
      <Sidebar setPage={setPage} />

      <div
        style={{
          marginLeft: "250px",
          padding: "30px",
          background: "#f4f6f9",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <h1>Enterprise AI Dashboard</h1>

        <p>Welcome, Project Manager 👋</p>

        {loading && (
          <p style={{ fontSize: "18px" }}>
            Loading dashboard data...
          </p>
        )}

        {error && (
          <p
            style={{
              color: "red",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            {error}
          </p>
        )}

        {summary && (
          <>
            {/* Dashboard Statistics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, 1fr)",
                gap: "20px",
                marginTop: "30px",
              }}
            >
              <div style={cardStyle}>
                <h2>{summary.total_projects}</h2>
                <p>Total Projects</p>
              </div>

              <div style={cardStyle}>
                <h2>{summary.total_tasks}</h2>
                <p>Total Tasks</p>
              </div>

              <div style={cardStyle}>
                <h2>{summary.completed_tasks}</h2>
                <p>Completed Tasks</p>
              </div>

              <div style={cardStyle}>
                <h2>{summary.pending_tasks}</h2>
                <p>Pending Tasks</p>
              </div>

              <div style={cardStyle}>
                <h2>{summary.in_progress_tasks}</h2>
                <p>In Progress</p>
              </div>

              <div style={cardStyle}>
                <h2>{summary.high_risk_tasks}</h2>
                <p>High Risk Tasks</p>
              </div>
            </div>

            {/* Overall Completion */}
            <div
              style={{
                marginTop: "40px",
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.1)",
                maxWidth: "600px",
              }}
            >
              <h2>Overall Completion</h2>

              <h1>
                {summary.completion_percentage}%
              </h1>

              <div
                style={{
                  background: "#e5e7eb",
                  borderRadius: "10px",
                  height: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${summary.completion_percentage}%`,
                    height: "100%",
                    background: "#2563eb",
                  }}
                />
              </div>
            </div>

            {/* AI Decision Analysis */}
            <div
              style={{
                marginTop: "40px",
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2>
                AI Decision & Risk Analysis
              </h2>

              {decisions.length === 0 ? (
                <p>
                  No tasks available for analysis.
                </p>
              ) : (
                decisions.map((task) => (
                  <div
                    key={task.task_id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      padding: "15px",
                      marginTop: "15px",
                    }}
                  >
                    <h3>{task.task_name}</h3>

                    <p>
                      <strong>Project:</strong>{" "}
                      {task.project}
                    </p>

                    <p>
                      <strong>Assignee:</strong>{" "}
                      {task.assignee}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {task.status}
                    </p>

                    <p>
                      <strong>Progress:</strong>{" "}
                      {task.progress}%
                    </p>

                    <p>
                      <strong>Risk Level:</strong>{" "}
                      {task.risk_level}
                    </p>

                    <p>
                      <strong>Decision:</strong>{" "}
                      {task.decision}
                    </p>

                    <p>
                      <strong>
                        Recommendation:
                      </strong>{" "}
                      {task.recommendation}
                    </p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;