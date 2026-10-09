import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext.js";
import api from "../services/api";
import "../css/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      setUser(response.data);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response?.status === 404) {
        setError("User not found.");
      } else if (error.response?.status === 401) {
        setError("Incorrect password.");
      } else {
        setError("Unable to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="login">
        <div className="login__container">
          <div className="login__header">
            <Link to="/" className="login__brand">
              BlogoSphere
            </Link>

            <Link to="/register" className="login__register-link">
              Register
            </Link>
          </div>

          <div className="login__content">
            <form className="login__form" onSubmit={handleLogin}>
              <div className="login__intro">
                <p className="login__eyebrow">Welcome back</p>

                <h1>Log in to your account</h1>

                <p>
                  Continue reading, writing, and sharing your
                  stories.
                </p>
              </div>

              <div className="login__field">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>

              <div className="login__field">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="login__error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="login__button"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>

              <p className="login__footer-text">
                New here?{" "}
                <Link to="/register">Create an account</Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Login;