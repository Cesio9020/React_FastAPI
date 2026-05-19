import "../css/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext"

function MovieCard({movie}) {
    const {isFavorite, addToFavorites, removeFromFavorites, setSelectedMovie} = useMovieContext()
    const favorite = isFavorite(movie.id)
    const year = movie.release_date?.split("-")[0] || "Unknown"
    const rating = movie.vote_average?.toFixed(1) || "0.0"
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null

    function onFavoriteClick(e) {
        e.preventDefault()
        e.stopPropagation()
        if (favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
    }

    function onMovieClick() {
        setSelectedMovie(movie)
    }

    return <div className="movie-card" onClick={onMovieClick}>
        <div className="movie-poster">
            {posterUrl ? (
                <img src={posterUrl} alt={movie.title}/>
            ) : (
                <div className="poster-fallback">
                    <span>{movie.title}</span>
                </div>
            )}
            <div className="movie-card-overlay" aria-hidden="true">
                <span className="play-indicator">▶</span>
                <span className="overlay-copy">Watch trailer</span>
            </div>
            <button
                type="button"
                className={`favorite-btn ${favorite ? "active" : ""}`}
                onClick={onFavoriteClick}
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
                ♥
            </button>
        </div>
        <div className="movie-info">
            <div className="title-row">
                <h3>{movie.title}</h3>
            </div>
            <div className="movie-meta-row">
                <span>{year}</span>
                <span className="movie-badge">{rating} ⭐</span>
            </div>
        </div>
    </div>
}

export default MovieCard
