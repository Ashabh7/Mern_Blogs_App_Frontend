import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FiMenu, FiX } from "react-icons/fi";

import { UserContext } from "../context/UserContext.js";
import Menu from "./Menu";
import "../css/Navbar.css";

function Navbar() {
  const { user } = useContext(UserContext);

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";

  function handleSearch(event) {
    event.preventDefault();

    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      navigate("/");
      return;
    }

    navigate(`/?search=${encodeURIComponent(trimmedSearch)}`);
  }

  function toggleMenu() {
    setMenuOpen((previous) => !previous);
  }

  return (
    <header className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__brand">
          BlogoSphere
        </Link>

        {isHomePage && (
          <form className="navbar__search" onSubmit={handleSearch}>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search posts..."
              aria-label="Search posts"
            />

            <button type="submit" aria-label="Search">
              <BsSearch />
            </button>
          </form>
        )}

        <nav className="navbar__desktop-nav">
          {user ? (
            <Link to="/write" className="navbar__write">
              Write
            </Link>
          ) : (
            <Link to="/login" className="navbar__login">
              Login
            </Link>
          )}

          <button
            type="button"
            className="navbar__menu-button"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </nav>

        {menuOpen && <Menu onClose={() => setMenuOpen(false)} />}
      </div>
    </header>
  );
}

export default Navbar;