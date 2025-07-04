import React, { useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import Content from "./Content";

const Search = () => {
  const { movies, series, popularMovies, loading, error, searchQuery } =
    useContext(MovieContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  // Use popularMovies or a random selection when searchQuery is empty
  const displayData = searchQuery.trim()
    ? [...movies, ...series]
    : popularMovies.length > 0
    ? popularMovies
    : [...movies, ...series].sort(() => Math.random() - 0.5).slice(0, 20); // Fallback to random selection, limited to 20 items

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-white mb-8">
        {searchQuery.trim() ? "Search Results" : "Popular Content"}
      </h2>
      {displayData.length === 0 ? (
        <p className="text-gray-400 text-lg">No content found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayData.map((item) => (
            <Content
              key={item.id}
              item={item}
              contentType={item.media_type === "movie" ? "movies" : "series"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
