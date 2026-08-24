import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Reports({ setPage }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/reports/summary", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Authentication expired. Please login again."
            );
          }

          throw new Error("Failed to fetch report data");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Reports Data:", data);

        setSummary(data.summary);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Reports API Error:", error);

        setError(
          error.message || "Unable to connect to backend"
        );

        setLoading(false);
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
      {/* Left Sidebar */}
      <Sidebar setPage={setPage} />

      {/* Reports Content */}
      <div
        style={{
          marginLeft: "250px",
          padding: "30px",
          background: "#f4f6f9",
          minHeight: "100vh",
        }}
      >
        <h1>Reports & Analytics</h1>

        <p>
          Monitor enterprise workflow performance and task progress.
        </p>

        {loading && (
          <p style={{ fontSize: "18px" }}>
            Loading reports...
          </p>
        )}

        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#fee2e2",
              color: "#b91c1c",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            ❌ {error}
          </div>
        )}

        {summary && (
          <>
            {/* Summary Cards */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
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

            {/* Completion Report */}

            <div
              style={{
                marginTop: "35px",
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2>Task Completion Report</h2>

              <div
                style={{
                  marginTop: "20px",
                  background: "#e5e7eb",
                  height: "30px",
                  borderRadius: "15px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${summary.completion_percentage}%`,
                    height: "100%",
                    background: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    transition: "width 0.5s ease",
                  }}
                >
                  {summary.completion_percentage}%
                </div>
              </div>

              <p style={{ marginTop: "15px" }}>
                Overall task completion:

                <strong>
                  {" "}
                  {summary.completion_percentage}%
                </strong>
              </p>
            </div>

            {/* Task Status Distribution */}

            <div
              style={{
                marginTop: "35px",
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2>Task Status Distribution</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    padding: "20px",
                    borderRadius: "10px",
                    background: "#e8f5e9",
                    textAlign: "center",
                  }}
                >
                  <h2>{summary.completed_tasks}</h2>
                  <p>Completed</p>
                </div>

                <div
                  style={{
                    padding: "20px",
                    borderRadius: "10px",
                    background: "#fff3cd",
                    textAlign: "center",
                  }}
                >
                  <h2>{summary.in_progress_tasks}</h2>
                  <p>In Progress</p>
                </div>

                <div
                  style={{
                    padding: "20px",
                    borderRadius: "10px",
                    background: "#f8d7da",
                    textAlign: "center",
                  }}
                >
                  <h2>{summary.pending_tasks}</h2>
                  <p>Pending</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Reports;