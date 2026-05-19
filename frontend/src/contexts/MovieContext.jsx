import {createContext, useState, useContext, useEffect} from "react"

const MovieContext = createContext()

function MovieProvider({children}) {
    const [favorites, setFavorites] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)

    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites")

        if (storedFavs) setFavorites(JSON.parse(storedFavs))
    }, [])

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

    const addToFavorites = (movie) => {
        setFavorites(prev => [...prev, movie])
    }

    const removeFromFavorites = (movieId) => {
        setFavorites(prev => prev.filter(movie => movie.id !== movieId))
    }
    
    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        selectedMovie,
        setSelectedMovie
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}

function useMovieContext() {
    return useContext(MovieContext)
}

export { MovieProvider, useMovieContext }