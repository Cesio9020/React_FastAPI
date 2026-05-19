const BASE_URL = "http://127.0.0.1:8000";


export const getPopularMovies = async (page = 1) => {

  const response = await fetch(`${BASE_URL}/movies?page=${page}`);

  const data = await response.json();

  return data.results;
};


export const searchMovies = async (query, page = 1) => {

  const response = await fetch(
    `${BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}`
  );

  const data = await response.json();

  return data.results;
};


export const getMovieTrailer = async (movieId) => {

  const response = await fetch(`${BASE_URL}/movie/${movieId}/videos`);

  const data = await response.json();

  // Find the official trailer
  const trailer = data.results?.find(video => 
    video.type === "Trailer" && video.site === "YouTube"
  );

  return trailer || null;
};