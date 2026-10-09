import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";

import Footer from "../components/Footer";
import api from "../services/api";
import "../css/Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();

    setError("");

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/auth/register", {
        username,
        email,
        password,
      });

      setUser(response.data);

      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);

      if (error.response?.status === 500) {
        setError("Unable to create account. Email may already be in use.");
      } else {
        setError("Unable to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="register">
        <div className="register__container">
          <div className="register__header">
            <Link to="/" className="register__brand">
              BlogoSphere
            </Link>

            <Link to="/login" className="register__login-link">
              Login
            </Link>
          </div>

          <div className="register__content">
            <form className="register__form" onSubmit={handleRegister}>
              <div className="register__intro">
                <p className="register__eyebrow">Join BlogoSphere</p>

                <h1>Create an account</h1>

                <p>Start sharing your ideas and discovering new stories.</p>
              </div>

              <div className="register__field">
                <label htmlFor="username">Username</label>

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>

              <div className="register__field">
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

              <div className="register__field">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <p className="register__error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="register__button"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Register"}
              </button>

              <p className="register__footer-text">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Register;
