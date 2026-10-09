import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext.js";
import api from "../services/api";
import "../css/Profile.css";

function Profile() {
  const { id: userId } = useParams();
  const { user, setUser, loading: userLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState("");

  const isOwnProfile = user?._id === userId;

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) return;

      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/api/users/${userId}`);

        setUsername(response.data.username);
        setEmail(response.data.email);

        // Never load the stored/hashed password into the frontend.
        setPassword("");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError("Unable to load this profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  async function handleUserUpdate(event) {
    event.preventDefault();

    setUpdated(false);
    setError("");

    if (!username.trim() || !email.trim()) {
      setError("Username and email are required.");
      return;
    }

    setUpdating(true);

    try {
      const updateData = {
        username: username.trim(),
        email: email.trim(),
      };

      if (password.trim()) {
        updateData.password = password;
      }

      await api.put(`/api/users/${userId}`, updateData);

      setUpdated(true);
      setPassword("");

      // Keep the local authentication state in sync.
      if (isOwnProfile) {
        setUser((previousUser) => ({
          ...previousUser,
          username: username.trim(),
          email: email.trim(),
        }));
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError(
        error.response?.data ||
          "Unable to update your profile. Please try again."
      );
      setUpdated(false);
    } finally {
      setUpdating(false);
    }
  }

  async function handleUserDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      await api.delete(`/api/users/${userId}`);

      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      setError(
        error.response?.data ||
          "Unable to delete your account. Please try again."
      );
      setDeleting(false);
    }
  }

  if (userLoading || loading) {
    return (
      <>
        <Navbar />

        <main className="profile__loading">
          <Loader />
        </main>

        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />

        <main className="profile__message">
          <h1>Login required</h1>
          <p>You need to log in to view your profile.</p>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </main>

        <Footer />
      </>
    );
  }

  if (!isOwnProfile) {
    return (
      <>
        <Navbar />

        <main className="profile__message">
          <h1>Profile unavailable</h1>
          <p>You can only manage your own profile.</p>

          <button
            type="button"
            onClick={() => navigate(`/profile/${user._id}`)}
          >
            Go to My Profile
          </button>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="profile">
        <div className="profile__container">
          <div className="profile__intro">
            <p className="profile__eyebrow">BlogoSphere</p>

            <h1>Your profile</h1>

            <p>
              Manage your account details and keep your profile up to date.
            </p>
          </div>

          <form
            className="profile__form"
            onSubmit={handleUserUpdate}
          >
            <div className="profile__field">
              <label htmlFor="username">Username</label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Your username"
                autoComplete="username"
              />
            </div>

            <div className="profile__field">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email"
                autoComplete="email"
              />
            </div>

            <div className="profile__field">
              <label htmlFor="password">New password</label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Leave blank to keep your password"
                autoComplete="new-password"
              />

              <p className="profile__hint">
                Only enter a password if you want to change it.
              </p>
            </div>

            {error && (
              <p className="profile__error" role="alert">
                {error}
              </p>
            )}

            {updated && (
              <p className="profile__success" role="status">
                Profile updated successfully!
              </p>
            )}

            <div className="profile__actions">
              <button
                type="submit"
                className="profile__update"
                disabled={updating || deleting}
              >
                {updating ? "Updating..." : "Update profile"}
              </button>

              <button
                type="button"
                className="profile__delete"
                onClick={handleUserDelete}
                disabled={updating || deleting}
              >
                {deleting ? "Deleting..." : "Delete account"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Profile;