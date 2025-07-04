import React, { useContext, useState } from "react";
import { MovieContext } from "../context/MovieContext";
import { Film, Star, Calendar, Play } from "lucide-react";

const Content = ({ item, contentType }) => {
  const { fetchTrailer } = useContext(MovieContext);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = () => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleWatchTrailer = async (id, type) => {
    const trailerUrl = await fetchTrailer(id, type);
    window.open(trailerUrl, "_blank");
  };

  return (
    <>
      <div
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
        onClick={handleItemClick}
      >
        <div className="relative">
          <div className="aspect-w-2 aspect-h-3 bg-gray-700">
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title || item.name}
              className="w-full h-80 object-cover"
            />
          </div>
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400" />
            <span>{item.vote_average}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
            {item.title || item.name}
          </h3>
          <div className="flex items-center text-gray-400 text-sm mb-3">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{item.release_date || item.first_air_date}</span>
          </div>
          <p className="text-gray-300 text-sm line-clamp-3 mb-4">
            {item.overview}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWatchTrailer(
                item.id,
                contentType === "series" ? "tv" : "movie"
              );
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Watch Trailer</span>
          </button>
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">
                  {selectedItem.title || selectedItem.name}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-white font-semibold">
                    {selectedItem.vote_average}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {selectedItem.release_date || selectedItem.first_air_date}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {selectedItem.overview}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() =>
                    handleWatchTrailer(
                      selectedItem.id,
                      contentType === "series" ? "tv" : "movie"
                    )
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Watch Trailer</span>
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Content;
