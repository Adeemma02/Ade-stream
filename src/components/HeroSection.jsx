import React, { useContext, useState, useEffect, useMemo } from "react";
import { MovieContext } from "../context/MovieContext";
import { Play } from "lucide-react";
import { Skeleton, Modal, Box } from "@mui/material";

const FALLBACK_IMAGE = "https://picsum.photos/1920/1080?blur=2";

const HeroSection = () => {
  const { trending, fetchTrailer } = useContext(MovieContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageError, setImageError] = useState({});
  const [isImageLoading, setIsImageLoading] = useState({});
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const heroItems = useMemo(() => {
    const validItems = trending.filter(
      (item) => item.backdrop_path && typeof item.backdrop_path === "string"
    );
    return validItems.length > 0
      ? validItems.sort(() => 0.5 - Math.random()).slice(0, 5)
      : [];
  }, [trending]);

  useEffect(() => {
    if (heroItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroItems.length]);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const handleWatchTrailer = async (item) => {
    if (item) {
      const type = item.media_type === "movie" ? "movie" : "tv";
      const url = await fetchTrailer(item.id, type);
      if (url) {
        setTrailerUrl(url);
      } else {
        setTrailerUrl(null);
      }
      setOpenModal(true);
    }
  };

  const handleImageLoad = (itemId) => {
    setIsImageLoading((prev) => ({ ...prev, [itemId]: false }));
  };

  const handleImageError = (itemId) => {
    setImageError((prev) => ({ ...prev, [itemId]: true }));
    setIsImageLoading((prev) => ({ ...prev, [itemId]: false }));
  };

  useEffect(() => {
    const initialLoading = heroItems.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {});
    setIsImageLoading(initialLoading);
  }, [heroItems]);

  return (
    <>
      <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroItems.map((item) => (
            <div
              key={item.id}
              className="min-w-full h-[60vh] md:h-[75vh] bg-cover bg-center relative"
            >
              {isImageLoading[item.id] && (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  sx={{ bgcolor: "grey.800" }}
                  animation="wave"
                />
              )}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    imageError[item.id]
                      ? FALLBACK_IMAGE
                      : `https://image.tmdb.org/t/p/original${item.backdrop_path}`
                  })`,
                }}
              >
                <img
                  src={
                    imageError[item.id]
                      ? FALLBACK_IMAGE
                      : `https://image.tmdb.org/t/p/original${item.backdrop_path}`
                  }
                  alt="hidden"
                  className="hidden"
                  onLoad={() => handleImageLoad(item.id)}
                  onError={() => handleImageError(item.id)}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center">
                  <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-white mb-4">
                      {item.title || item.name || "Untitled"}
                    </h1>
                    <p className="text-gray-200 text-lg mb-6 line-clamp-3 max-w-2xl">
                      {item.overview || "No overview available."}
                    </p>
                    <button
                      onClick={() => handleWatchTrailer(item)}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
                    >
                      <Play className="h-5 w-5" />
                      <span>Watch Trailer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {heroItems.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? "bg-red-500" : "bg-gray-400"
              }`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setTrailerUrl(null);
        }}
        aria-labelledby="trailer-modal"
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
            onClick={() => {
              setOpenModal(false);
              setTrailerUrl(null);
            }}
            className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg w-full"
          >
            Close
          </button>
        </Box>
      </Modal>
    </>
  );
};

export default HeroSection;
