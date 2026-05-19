import "../css/Favorites.css";
import { Link } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";
import TrailerModal from "../components/TrailerModal";

function Favorites() {
  const { favorites, selectedMovie, setSelectedMovie } = useMovieContext();

  if (favorites.length > 0) {
    return (
      <div className="favorites">
        <div className="favorites-header">
          <span className="favorites-kicker">Saved collection</span>
          <h2>Your Favorites</h2>
          <p>{favorites.length} movie{favorites.length === 1 ? "" : "s"} ready when you are.</p>
        </div>
        <div className="movies-grid">
          {favorites.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
        {selectedMovie && (
          <TrailerModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="favorites-empty">
      <div className="empty-icon" aria-hidden="true">♥</div>
      <h2>No Favorite Movies Yet</h2>
      <p>Start adding movies to your favorites and they will appear here!</p>
      <Link to="/" className="browse-movies-link">Browse movies</Link>
    </div>
  );
}

export default Favorites;
