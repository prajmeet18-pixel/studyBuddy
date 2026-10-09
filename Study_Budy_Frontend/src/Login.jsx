import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "./api";

function Login() {
  const nav = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");

    api
      .post("/user/login", {
        User_email: data.email,
        User_password: data.password,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        nav("/dashboard");
      })
      .catch((err) => {
        setError(err.response?.data?.msg || "Invalid email or password");
      });
  };

  return (
    <main className="auth-page">
      <section className="auth-story">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>StudyBuddy</span>
        </div>
        <div className="story-copy">
          <span className="story-eyebrow">LEARN AT YOUR OWN PACE</span>
          <h1>Small steps.<br />Big understanding.</h1>
          <p>Your friendly study companion is ready to help you make sense of the tough stuff.</p>
        </div>
        <p className="story-note">A calmer way to keep learning.</p>
      </section>

      <section className="auth-content">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Pick up where your curiosity left off.</p>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="loginEmail">Email address</label>
              <input
                name="email"
                onChange={handleChange}
                type="email"
                value={data.email}
                id="loginEmail"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="loginPassword">Password</label>
              <input
                name="password"
                value={data.password}
                onChange={handleChange}
                type="password"
                id="loginPassword"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="primary-button" type="submit">Log in to StudyBuddy <span aria-hidden="true">→</span></button>
          </form>

          <p className="auth-switch">
            New to StudyBuddy? <button className="text-button" type="button" onClick={() => nav("/")}>Create an account</button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
