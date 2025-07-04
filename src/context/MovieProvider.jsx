import React, { useState, useEffect } from "react";
import axios from "axios";
import { MovieContext } from "./MovieContext";

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newMovies, setNewMovies] = useState([]);
  const [newSeries, setNewSeries] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [contentType, setContentType] = useState("home");
  const [filter, setFilter] = useState("popular");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    // console.log(
    //   "VITE_TMDB_API_KEY in production:",
    //   import.meta.env.VITE_TMDB_API_KEY
    // );
    if (!API_KEY) {
      setError("TMDB API key is missing. Please check environment variables.");
      setLoading(false);
      console.error("API Key Missing: VITE_TMDB_API_KEY is not set.");
      return;
    }

    const fetchHomeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoints = [
          {
            url: `${BASE_URL}/trending/all/day?api_key=${API_KEY}&language=en-US`,
            setter: setTrending,
            name: "Trending",
          },
          {
            url: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`,
            setter: setNewMovies,
            name: "New Movies",
          },
          {
            url: `${BASE_URL}/tv/airing_today?api_key=${API_KEY}&language=en-US&page=1`,
            setter: setNewSeries,
            name: "New Series",
          },
          {
            url: `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
            setter: (data) => {
              setPopularMovies(data);
              setRecommended(data.sort(() => 0.5 - Math.random()).slice(0, 10));
            },
            name: "Popular Movies",
          },
          {
            url: `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`,
            setter: setPopularSeries,
            name: "Popular Series",
          },
          {
            url: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
            setter: setTopRatedMovies,
            name: "Top Rated Movies",
          },
          {
            url: `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
            setter: setTopRatedSeries,
            name: "Top Rated Series",
          },
        ];

        for (const { url, setter, name } of endpoints) {
          try {
            const response = await axios.get(url);
            console.log(`${name} Data:`, response.data.results);
            setter(response.data.results);
          } catch (err) {
            console.error(`Error fetching ${name}:`, {
              message: err.message,
              status: err.response?.status,
              data: err.response?.data,
            });
            throw new Error(`Failed to fetch ${name}: ${err.message}`);
          }
        }
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch home data: ${err.message}`);
        setLoading(false);
        console.error("Error fetching home data:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
      }
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      let url = "";

      if (contentType === "home") {
        fetchHomeData();
        return;
      } else if (contentType === "movies") {
        if (filter === "popular")
          url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        else if (filter === "newly-released")
          url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
        else if (filter === "animation")
          url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=16&page=1`;
        else if (filter === "top-rated")
          url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
      } else if (contentType === "series") {
        if (filter === "popular")
          url = `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`;
        else if (filter === "newly-released")
          url = `${BASE_URL}/tv/airing_today?api_key=${API_KEY}&language=en-US&page=1`;
        else if (filter === "animation")
          url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&with_genres=16&page=1`;
        else if (filter === "top-rated")
          url = `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
      } else if (contentType === "animation") {
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=16&page=1`;
      } else if (contentType === "search" && searchQuery) {
        url = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          searchQuery
        )}&page=1`;
      } else if (contentType === "genre") {
        url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
      }

      if (!url) {
        setError("Invalid content type or filter");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(url);
        console.log(
          `Fetched ${contentType} (${filter}):`,
          response.data.results
        );
        if (
          contentType === "movies" ||
          contentType === "animation" ||
          contentType === "genre"
        ) {
          setMovies(response.data.results);
          setSeries([]);
        } else if (contentType === "series") {
          setSeries(response.data.results);
          setMovies([]);
        } else if (contentType === "search") {
          setMovies(
            response.data.results.filter((item) => item.media_type === "movie")
          );
          setSeries(
            response.data.results.filter((item) => item.media_type === "tv")
          );
        }
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`);
        setLoading(false);
        console.error(`Error fetching ${contentType} (${filter}):`, {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
      }
    };

    fetchData();
  }, [API_KEY, contentType, filter, searchQuery]);

  const fetchTrailer = async (id, type) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`
      );
      const trailer = response.data.results.find(
        (video) => video.type === "Trailer"
      );
      console.log(`Trailer for ${type} ID ${id}:`, trailer);
      return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    } catch (err) {
      console.error("Error fetching trailer:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      return null;
    }
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        series,
        trending,
        newMovies,
        newSeries,
        recommended,
        popularMovies,
        popularSeries,
        topRatedMovies,
        topRatedSeries,
        contentType,
        setContentType,
        filter,
        setFilter,
        loading,
        error,
        fetchTrailer,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export default MovieProvider;
