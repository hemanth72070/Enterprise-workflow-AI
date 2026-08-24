import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function AIAssistant({ setPage }) {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // CHATBOT STATE
  // ==============================
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I'm your AI Assistant. Ask me about tasks, projects, risks, or workflow status.",
    },
  ]);

  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // ==============================
  // EXISTING AI DECISION ENGINE
  // ==============================
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/decisions/scan", {
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

          throw new Error(
            "Failed to fetch AI decision data"
          );
        }

        return response.json();
      })
      .then((data) => {
        console.log("AI Decision Data:", data);

        setDecisions(data.results || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("AI Assistant Error:", error);

        setError(
          error.message ||
            "Unable to connect to AI Decision Engine"
        );

        setLoading(false);
      });
  }, []);

  // ==============================
  // CHATBOT API
  // ==============================
  const sendMessage = async () => {
    const question = input.trim();

    if (!question || chatLoading) {
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Your session has expired. Please login again.",
        },
      ]);
      return;
    }

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: question,
      },
    ]);

    setInput("");
    setChatLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/assistant/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: question,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to get AI Assistant response"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            data.answer ||
            "I couldn't find an answer for that question.",
        },
      ]);
    } catch (error) {
      console.error(
        "Chatbot Error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "⚠️ Unable to connect to the AI Assistant. Please make sure the backend is running.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Send message with Enter
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  // ==============================
  // RISK STYLE
  // ==============================
  const getRiskStyle = (risk) => {
    if (risk === "HIGH") {
      return {
        background: "#fee2e2",
        color: "#dc2626",
      };
    }

    if (risk === "MEDIUM") {
      return {
        background: "#fef3c7",
        color: "#d97706",
      };
    }

    return {
      background: "#dcfce7",
      color: "#16a34a",
    };
  };

  return (
    <>
      {/* Left Sidebar */}
      <Sidebar
        page="assistant"
        setPage={setPage}
      />

      {/* AI Assistant Content */}
      <div
        style={{
          marginLeft: "250px",
          padding: "30px",
          background: "#f4f6f9",
          minHeight: "100vh",
        }}
      >
        <h1>🤖 AI Assistant</h1>

        <p>
          AI-powered decision automation and workflow risk analysis.
        </p>

        {/* ==============================
            CHATBOT
        ============================== */}

        <div
          style={{
            marginTop: "25px",
            background: "white",
            borderRadius: "15px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              background: "#7c3aed",
              color: "white",
              padding: "18px 22px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
              }}
            >
              💬 Chat with AI Assistant
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                fontSize: "13px",
                opacity: 0.9,
              }}
            >
              Ask questions about your workflow
            </p>
          </div>

          {/* Messages */}
          <div
            style={{
              height: "300px",
              overflowY: "auto",
              padding: "20px",
              background: "#f8f8fb",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    message.sender === "user"
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "11px 15px",
                    borderRadius: "12px",
                    background:
                      message.sender === "user"
                        ? "#7c3aed"
                        : "white",
                    color:
                      message.sender === "user"
                        ? "white"
                        : "#222",
                    boxShadow:
                      "0 2px 5px rgba(0,0,0,0.08)",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div
                style={{
                  color: "#666",
                  fontSize: "14px",
                }}
              >
                🤖 AI is thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              padding: "15px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask about tasks, projects, risks..."
              style={{
                flex: 1,
                padding: "12px 15px",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                outline: "none",
                fontSize: "14px",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={chatLoading}
              style={{
                padding: "0 20px",
                border: "none",
                borderRadius: "10px",
                background: chatLoading
                  ? "#aaa"
                  : "#7c3aed",
                color: "white",
                cursor: chatLoading
                  ? "not-allowed"
                  : "pointer",
                fontSize: "18px",
              }}
            >
              ➤
            </button>
          </div>

          {/* Quick Questions */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              padding: "0 15px 15px",
            }}
          >
            <button
              onClick={() => {
                setInput("Show pending tasks");
              }}
              style={{
                padding: "7px 12px",
                borderRadius: "20px",
                border: "1px solid #ddd",
                background: "white",
                cursor: "pointer",
              }}
            >
              Pending Tasks
            </button>

            <button
              onClick={() => {
                setInput("Show high risk tasks");
              }}
              style={{
                padding: "7px 12px",
                borderRadius: "20px",
                border: "1px solid #ddd",
                background: "white",
                cursor: "pointer",
              }}
            >
              High Risk
            </button>

            <button
              onClick={() => {
                setInput("Show completed tasks");
              }}
              style={{
                padding: "7px 12px",
                borderRadius: "20px",
                border: "1px solid #ddd",
                background: "white",
                cursor: "pointer",
              }}
            >
              Completed
            </button>

            <button
              onClick={() => {
                setInput("Show projects");
              }}
              style={{
                padding: "7px 12px",
                borderRadius: "20px",
                border: "1px solid #ddd",
                background: "white",
                cursor: "pointer",
              }}
            >
              Projects
            </button>
          </div>
        </div>

        {/* ==============================
            EXISTING LOADING
        ============================== */}

        {loading && (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              marginTop: "25px",
              boxShadow:
                "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>
              AI Engine is analyzing tasks...
            </h3>

            <p>
              Please wait while the decision engine evaluates
              the workflow.
            </p>
          </div>
        )}

        {/* Existing Error */}
        {error && (
          <div
            style={{
              marginTop: "25px",
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "20px",
              borderRadius: "12px",
              fontWeight: "bold",
            }}
          >
            ❌ {error}
          </div>
        )}

        {/* ==============================
            EXISTING AI RESULTS
        ============================== */}

        {!loading && !error && (
          <>
            <div
              style={{
                marginTop: "25px",
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2>🧠 AI Decision Engine</h2>

              <p>
                The AI engine has analyzed{" "}
                <strong>{decisions.length}</strong>{" "}
                workflow tasks.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "20px",
                marginTop: "25px",
              }}
            >
              {decisions.map((item) => (
                <div
                  key={item.task_id}
                  style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow:
                      "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <h3>{item.task_name}</h3>

                    <span
                      style={{
                        ...getRiskStyle(
                          item.risk_level
                        ),
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontWeight: "bold",
                        fontSize: "13px",
                      }}
                    >
                      {item.risk_level}
                    </span>
                  </div>

                  <p>
                    <strong>Project:</strong>{" "}
                    {item.project}
                  </p>

                  <p>
                    <strong>Assignee:</strong>{" "}
                    {item.assignee}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {item.status}
                  </p>

                  <p>
                    <strong>Progress:</strong>{" "}
                    {item.progress}%
                  </p>

                  <hr />

                  <h4>Decision</h4>

                  <p
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {item.decision}
                  </p>

                  <h4>Recommendation</h4>

                  <p>
                    {item.recommendation}
                  </p>

                  {item.reason && (
                    <>
                      <h4>Reason</h4>

                      <p>
                        {item.reason}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>

            {decisions.length === 0 && (
              <div
                style={{
                  marginTop: "25px",
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <h3>
                  No AI decisions available
                </h3>

                <p>
                  No tasks were returned by the Decision Engine.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default AIAssistant;