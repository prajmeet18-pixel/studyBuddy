import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "./api";

function Signup() {
  const nav = useNavigate();
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleRegister = (event) => {
    event.preventDefault();
    setError("");

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    api
      .post("/user/register", {
        User_name: `${data.firstname} ${data.lastname}`.trim(),
        User_email: data.email,
        User_password: data.password,
      })
      .then(() => nav("/log"))
      .catch((err) => {
        setError(err.response?.data?.msg || "Registration failed");
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
          <span className="story-eyebrow">A BETTER WAY TO STUDY</span>
          <h1>Curiosity is a great place to start.</h1>
          <p>Build confidence one question at a time, with a study companion that meets you where you are.</p>
        </div>
        <p className="story-note">Make room for a little more understanding.</p>
      </section>

      <section className="auth-content">
        <div className="auth-card">
          <h2>Create your account</h2>
          <p className="auth-subtitle">Set up your free account and start learning at your pace.</p>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="field-row">
              <div className="field">
                <label htmlFor="firstname">First name</label>
                <input
                  name="firstname"
                  value={data.firstname}
                  onChange={handleChange}
                  type="text"
                  id="firstname"
                  placeholder="Alex"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="lastname">Last name</label>
                <input
                  name="lastname"
                  value={data.lastname}
                  onChange={handleChange}
                  type="text"
                  id="lastname"
                  placeholder="Morgan"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="signupEmail">Email address</label>
              <input
                name="email"
                value={data.email}
                onChange={handleChange}
                type="email"
                id="signupEmail"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="signupPassword">Create password</label>
              <input
                name="password"
                value={data.password}
                onChange={handleChange}
                type="password"
                id="signupPassword"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                type="password"
                id="confirmPassword"
                placeholder="Enter your password again"
                autoComplete="new-password"
                required
              />
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="primary-button" type="submit">Create account <span aria-hidden="true">→</span></button>
          </form>

          <p className="auth-switch">
            Already have an account? <button className="text-button" type="button" onClick={() => nav("/log")}>Log in</button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Signup;
