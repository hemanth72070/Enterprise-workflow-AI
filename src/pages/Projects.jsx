import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Projects({ setPage }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Authentication required. Please login again.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/projects/", {
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
          throw new Error("Failed to fetch projects");
        }

        return response.json();
      })
      .then((data) => {
        setProjects(data.projects);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Projects API Error:", error);
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
        <h1>Projects</h1>

        <p>
          Manage and monitor enterprise workflow projects.
        </p>

        {loading && (
          <p style={{ fontSize: "18px" }}>
            Loading projects...
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
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow:
                "0 4px 10px rgba(0,0,0,0.1)",
              marginTop: "25px",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
              }}
            >
              <thead>
                <tr>
                  <th style={headerStyle}>
                    Project
                  </th>

                  <th style={headerStyle}>
                    Manager
                  </th>

                  <th style={headerStyle}>
                    Status
                  </th>

                  <th style={headerStyle}>
                    Progress
                  </th>

                  <th style={headerStyle}>
                    Tasks
                  </th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td style={cellStyle}>
                      <strong>
                        {project.name}
                      </strong>

                      <br />

                      <small>
                        {project.description}
                      </small>
                    </td>

                    <td style={cellStyle}>
                      {project.manager}
                    </td>

                    <td style={cellStyle}>
                      {project.status}
                    </td>

                    <td style={cellStyle}>
                      {project.progress}%
                    </td>

                    <td style={cellStyle}>
                      {project.tasks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

const headerStyle = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "2px solid #ddd",
  background: "#f1f3f5",
};

const cellStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

export default Projects;