import { useState } from "react";

function Login({ setPage, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid email or password."
        );
      }

      if (!data.access_token) {
        throw new Error(
          "Login succeeded, but the server did not return an access token."
        );
      }

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      console.log("Login successful");

      setIsLoggedIn(true);
      setPage("dashboard");
    } catch (error) {
      console.error("Login Error:", error);

      localStorage.removeItem("access_token");

      setError(
        error.message ||
          "Unable to connect to authentication server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eff6ff, #f8fafc)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "400px",
          maxWidth: "100%",
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              margin: "0 auto 15px",
              background: "#2563eb",
              color: "white",
              borderRadius: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            AI
          </div>

          <h1
            style={{
              color: "#2563eb",
              margin: "0",
              fontSize: "28px",
            }}
          >
            Enterprise AI
          </h1>

          <p style={{ color: "#64748b" }}>
            Enterprise Workflow Platform
          </p>
        </div>

        <h2
          style={{
            marginBottom: "8px",
            color: "#1e293b",
          }}
        >
          Welcome Back
        </h2>

        <p
          style={{
            color: "#64748b",
            marginBottom: "25px",
          }}
        >
          Sign in to continue to your dashboard.
        </p>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#334155",
            }}
          >
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            placeholder="Enter your email"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              marginBottom: "20px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              boxSizing: "border-box",
              fontSize: "15px",
            }}
          />

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#334155",
            }}
          >
            Password
          </label>

          <div
            style={{
              position: "relative",
              marginBottom: "25px",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                paddingRight: "70px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              disabled={loading}
              style={{
                position: "absolute",
                right: "8px",
                top: "7px",
                border: "none",
                background: "transparent",
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading
                ? "#93c5fd"
                : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          Enterprise Workflow Platform
        </p>
      </div>
    </div>
  );
}

export default Login;