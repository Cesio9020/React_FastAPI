import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/Navbar.css";

function NavBar() {
  const { favorites } = useMovieContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeGenre = searchParams.get("genre") || "";
  const activeQuery = searchParams.get("query") || "";
  const [searchValue, setSearchValue] = useState(activeQuery);
  const favoriteCount = favorites.length;
  const genres = ["Action", "Comedy", "Horror", "Sci-Fi", "Animation"];

  useEffect(() => {
    setSearchValue(activeQuery);
  }, [activeQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchValue.trim();
    navigate(trimmedQuery ? `/?query=${encodeURIComponent(trimmedQuery)}` : "/");
  };

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <form className="navbar-search" onSubmit={handleSearchSubmit} role="search">
        <input
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search movies"
          aria-label="Search movies"
        />
        <button type="submit" aria-label="Search movies">
          🔍
        </button>
      </form>

      <div className="navbar-genres" aria-label="Movie genres">
        {genres.map((genre) => (
          <Link
            key={genre}
            to={`/?genre=${encodeURIComponent(genre)}`}
            className={`genre-link${activeGenre === genre ? " active" : ""}`}
          >
            {genre}
          </Link>
        ))}
      </div>

      <div className="navbar-links">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link${isActive && !activeGenre && !activeQuery ? " active" : ""}`}
        >
          Home
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          <span>Favorites</span>
          <span className="nav-badge" aria-label={`${favoriteCount} favorite movies`}>
            {favoriteCount}
          </span>
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
