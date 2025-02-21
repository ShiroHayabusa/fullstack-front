import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed. Please check your credentials.");
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      navigate("/");

      if (data.token) {
        login(data.token);
        navigate("/");
      } else {
        throw new Error("No token in response.");
      }

    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Sign In</h2>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="identifier"
              placeholder="Username or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
          <div className="text-center mt-3">
            <a href="/users/register" className="text-decoration-none">
              Don't have an account? Sign Up
            </a>
          </div>
          <div className="text-center mt-3">
            <a href="/users/forgot-password" className="text-decoration-none">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
