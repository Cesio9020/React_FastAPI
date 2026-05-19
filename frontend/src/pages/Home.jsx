import MovieCard from "../components/MovieCard";
import TrailerModal from "../components/TrailerModal";
import { useCallback, useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies, getPopularMovies } from "../services/api";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/Home.css";

function Home() {
  const [searchParams] = useSearchParams();

  const selectedGenre = searchParams.get("genre") || "";
  const searchQuery = searchParams.get("query") || "";

  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { selectedMovie, setSelectedMovie } = useMovieContext();

  const loadMoreRef = useRef(null);

  // Filter movies that START with the search query
  const filterMoviesByStart = (moviesList, query) => {
    return moviesList.filter((movie) =>
      movie.title.toLowerCase().startsWith(query.toLowerCase())
    );
  };

  // Load movies
  const loadMovies = useCallback(
    async ({ genre = "", query = "" } = {}) => {
      setLoading(true);

      try {
        let nextMovies = [];

        if (query) {
          const results = await searchMovies(query, 1);

          // Only movies starting with typed characters
          nextMovies = filterMoviesByStart(results, query);
        } else if (genre) {
          nextMovies = await searchMovies(genre, 1);
        } else {
          nextMovies = await getPopularMovies(1);
        }

        setMovies(nextMovies);
        setPage(1);
        setHasMore(nextMovies.length >= 20);
        setError(null);
      } catch (err) {
        console.log(err);

        setError(
          query
            ? "Failed to search movies..."
            : genre
            ? "Failed to load genre..."
            : "Failed to load movies..."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Reload when query or genre changes
  useEffect(() => {
    loadMovies({
      genre: selectedGenre,
      query: searchQuery,
    });
  }, [loadMovies, searchQuery, selectedGenre]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          movies.length > 0
        ) {
          setLoading(true);

          try {
            const nextPage = page + 1;

            let newMovies = [];

            if (searchQuery) {
              const results = await searchMovies(
                searchQuery,
                nextPage
              );

              // Filter by starting characters
              newMovies = filterMoviesByStart(
                results,
                searchQuery
              );
            } else if (selectedGenre) {
              newMovies = await searchMovies(
                selectedGenre,
                nextPage
              );
            } else {
              newMovies = await getPopularMovies(nextPage);
            }

            if (newMovies.length > 0) {
              setMovies((prev) => [...prev, ...newMovies]);

              setPage(nextPage);

              setHasMore(newMovies.length >= 20);
            } else {
              setHasMore(false);
            }
          } catch (err) {
            console.log(err);

            setError("Failed to load more movies...");
          } finally {
            setLoading(false);
          }
        }
      },
      {
        threshold: 0.1,
      }
    );

    const loadMoreElement = loadMoreRef.current;

    if (loadMoreElement) {
      observer.observe(loadMoreElement);
    }

    return () => {
      if (loadMoreElement) {
        observer.unobserve(loadMoreElement);
      }
    };
  }, [
    page,
    hasMore,
    loading,
    searchQuery,
    selectedGenre,
    movies.length,
  ]);

  return (
    <div className="home">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">
            Discover the latest movies
          </span>

          <h1>Find your next favorite film</h1>

          <p>
            Browse trending titles, watch trailers instantly,
            and build a watchlist that actually feels worth
            coming back to.
          </p>
        </div>

        <div
          className="hero-highlights"
          aria-label="App highlights"
        >
          <div className="highlight-card">
            <span className="highlight-value">Live</span>

            <span className="highlight-label">
              movie search
            </span>
          </div>

          <div className="highlight-card">
            <span className="highlight-value">HD</span>

            <span className="highlight-label">
              trailer previews
            </span>
          </div>

          <div className="highlight-card">
            <span className="highlight-value">∞</span>

            <span className="highlight-label">
              scroll discovery
            </span>
          </div>
        </div>
      </section>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="results-header">
        {!loading && movies.length > 0 && (
          <>
            <div>
              <span className="section-kicker">
                {searchQuery
                  ? "Search"
                  : selectedGenre
                  ? "Genre"
                  : "Trending now"}
              </span>

              <h2>
                {searchQuery
                  ? `"${searchQuery}"`
                  : selectedGenre || "Popular Movies"}
              </h2>
            </div>

            <span className="results-count">
              {movies.length} title
              {movies.length === 1 ? "" : "s"}
            </span>
          </>
        )}
      </div>

      {movies.length > 0 ? (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard
              movie={movie}
              key={movie.id}
            />
          ))}
        </div>
      ) : loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading...
        </div>
      ) : (
        <div className="empty-results">
          <p>
            No movies found. Try a different search term or
            refresh for trending titles.
          </p>
        </div>
      )}

      {/* Infinite scroll trigger */}
      {hasMore && movies.length > 0 && (
        <div
          ref={loadMoreRef}
          className="load-more-trigger"
        >
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              Loading more...
            </div>
          )}
        </div>
      )}

      {/* Trailer modal */}
      {selectedMovie && (
        <TrailerModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default Home;