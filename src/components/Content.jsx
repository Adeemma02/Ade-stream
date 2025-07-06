import React, { useContext, useState } from "react";
import { MovieContext } from "../context/MovieContext";
import { Star, Calendar, Play } from "lucide-react";
import { Modal, Box } from "@mui/material";

const Content = ({ item, contentType }) => {
  const { fetchTrailer } = useContext(MovieContext);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
    setTrailerUrl(null);
  };

  const handleWatchTrailer = async (id, type) => {
    const url = await fetchTrailer(id, type);
    if (url) {
      setTrailerUrl(url);
    } else {
      setTrailerUrl(null);
    }
    setOpenModal(true);
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg md:h-[380px] h-[365px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
        <div className="relative">
          <div className="aspect-w-2 aspect-h-3 bg-gray-700">
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title || item.name}
              className="w-full h-36 md:h-40 object-cover"
            />
          </div>
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400" />
            <span>{item.vote_average}</span>
          </div>
        </div>
        <div className="p-4 flex flex-col justify-between">
          <h3 className="text-white font-semibold text-base mb-2 line-clamp-2 min-h-[2.75rem]">
            {item.title || item.name}
          </h3>

          <div className="flex items-center text-gray-400 text-[12px] mb-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{item.release_date || item.first_air_date}</span>
          </div>
          <p className="text-gray-300 text-[12px] line-clamp-3 mb-4">
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
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Watch Trailer</span>
          </button>
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="content-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "rgb(31, 41, 55)",
            borderRadius: "8px",
            maxWidth: "32rem",
            width: "100%",
            p: 3,
          }}
        >
          {trailerUrl ? (
            <div className="relative" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={trailerUrl.replace("watch?v=", "embed/")}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          ) : (
            <p className="text-white text-center text-lg">
              No trailer available
            </p>
          )}
          <button
            onClick={handleCloseModal}
            className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg w-full"
          >
            Close
          </button>
        </Box>
      </Modal>
    </>
  );
};

export default Content;
