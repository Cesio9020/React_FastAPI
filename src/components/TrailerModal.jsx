import { useEffect, useState } from "react"
import { getMovieTrailer } from "../services/api"
import "../css/TrailerModal.css"

function TrailerModal({ movie, onClose }) {
    const [trailer, setTrailer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const year = movie.release_date?.split("-")[0] || "Unknown"
    const rating = movie.vote_average?.toFixed(1) || "0.0"

    useEffect(() => {
        const fetchTrailer = async () => {
            try {
                setLoading(true)
                const trailerData = await getMovieTrailer(movie.id)
                setTrailer(trailerData)
                if (!trailerData) {
                    setError("Trailer not available for this movie")
                }
            } catch (err) {
                console.log(err)
                setError("Failed to load trailer")
            } finally {
                setLoading(false)
            }
        }

        fetchTrailer()
    }, [movie.id])

    return (
        <div className="trailer-modal-overlay" onClick={onClose}>
            <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="modal-header">
                    <div className="movie-poster-section">
                        <img 
                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                            alt={movie.title}
                            className="movie-poster-img"
                        />
                    </div>
                    <div className="movie-details-section">
                        <h1>{movie.title}</h1>
                        <div className="movie-meta">
                            <span className="year">{year}</span>
                            <span className="divider">•</span>
                            <span className="rating">
                                <span className="star">★</span> {rating}/10
                            </span>
                        </div>
                        {movie.overview && (
                            <p className="overview">{movie.overview}</p>
                        )}
                    </div>
                </div>

                {loading && <div className="loading"><div className="spinner"></div>Loading trailer...</div>}
                
                {error && <div className="error-message">{error}</div>}
                
                {trailer && (
                    <div className="trailer-container">
                        <div className="video-label">Official Trailer</div>
                        <iframe
                            width="100%"
                            height="600"
                            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                            title={`${movie.title} Trailer`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TrailerModal
