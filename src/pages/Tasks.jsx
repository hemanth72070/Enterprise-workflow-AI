import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Tasks({ setPage }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Authentication required. Please login again.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/tasks/", {
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
          throw new Error("Failed to fetch tasks");
        }

        return response.json();
      })
      .then((data) => {
        setTasks(data.tasks);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Tasks API Error:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

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
        <h1>Tasks</h1>

        <p>
          Manage and monitor enterprise workflow tasks.
        </p>

        {loading && (
          <p style={{ fontSize: "18px" }}>
            Loading tasks...
          </p>
        )}

        {error && (
          <p
            style={{
              color: "red",
              fontWeight: "bold",
            }}
          >
            ❌ {error}
          </p>
        )}

        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, 1fr)",
              gap: "20px",
              marginTop: "25px",
            }}
          >
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow:
                    "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h2>{task.name}</h2>

                <p>
                  <strong>Project:</strong>{" "}
                  {task.project}
                </p>

                <p>
                  <strong>Assignee:</strong>{" "}
                  {task.assignee}
                </p>

                <p>
                  <strong>Priority:</strong>{" "}
                  {task.priority}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {task.status}
                </p>

                <p>
                  <strong>Due Date:</strong>{" "}
                  {task.due_date}
                </p>

                <p>
                  <strong>Progress:</strong>{" "}
                  {task.progress}%
                </p>

                <div
                  style={{
                    background: "#e5e7eb",
                    height: "10px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginTop: "10px",
                  }}
                >
                  <div
                    style={{
                      width: `${task.progress}%`,
                      height: "100%",
                      background: "#2563eb",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Tasks;