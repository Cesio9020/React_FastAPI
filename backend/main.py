from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from typing import List
from dotenv import load_dotenv
import os


load_dotenv()

app = FastAPI()

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TMDB configuration
API_KEY = os.getenv("TMDB_API_KEY")

if not API_KEY:
    raise ValueError("TMDB_API_KEY not found")

BASE_URL = "https://api.themoviedb.org/3"


# -----------------------------
# Pydantic Models
# -----------------------------

class Movie(BaseModel):
    id: int
    title: str
    overview: str
    poster_path: str | None = None
    release_date: str | None = None
    vote_average: float


class MovieResponse(BaseModel):
    results: List[Movie]


# -----------------------------
# Routes
# -----------------------------

@app.get("/")
def home():
    return {"message": "FastAPI movie server is running"}


# Popular movies
@app.get("/movies", response_model=MovieResponse)
def get_movies(page: int = 1):

    url = f"{BASE_URL}/movie/popular?api_key={API_KEY}&page={page}"

    response = requests.get(url)

    data = response.json()

    return {
        "results": data["results"]
    }


# Search movies
@app.get("/search", response_model=MovieResponse)
def search_movies(query: str, page: int = 1):

    url = (
        f"{BASE_URL}/search/movie"
        f"?api_key={API_KEY}"
        f"&query={query}"
        f"&page={page}"
    )

    response = requests.get(url)

    data = response.json()

    return {
        "results": data["results"]
    }


# Single movie details
@app.get("/movie/{movie_id}")
def get_movie(movie_id: int):

    url = (
        f"{BASE_URL}/movie/{movie_id}"
        f"?api_key={API_KEY}"
    )

    response = requests.get(url)

    return response.json()


# Movie trailers/videos
@app.get("/movie/{movie_id}/videos")
def get_movie_videos(movie_id: int):

    url = (
        f"{BASE_URL}/movie/{movie_id}/videos"
        f"?api_key={API_KEY}"
    )

    response = requests.get(url)

    return response.json()