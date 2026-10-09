import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../context/UserContext.js";
import api from "../services/api";
import "../css/Menu.css";

function Menu({ onClose }) {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await api.get("/api/auth/logout");

      setUser(null);
      onClose();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  function handleNavigation() {
    onClose();
  }

  return (
    <div className="menu">
      {!user && (
        <>
          <Link to="/login" onClick={handleNavigation}>
            Login
          </Link>

          <Link to="/register" onClick={handleNavigation}>
            Register
          </Link>
        </>
      )}

      {user && (
        <>
          <Link
            to={`/profile/${user._id}`}
            onClick={handleNavigation}
          >
            Profile
          </Link>

          <Link to="/write" onClick={handleNavigation}>
            Write
          </Link>

          <Link
            to={`/myblogs/${user._id}`}
            onClick={handleNavigation}
          >
            My Blogs
          </Link>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default Menu;