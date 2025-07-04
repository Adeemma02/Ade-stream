import React, { useContext, useState, useEffect } from "react";
import { MovieContext } from "../context/MovieContext";
import { Play } from "lucide-react";

// Fallback image URL
const FALLBACK_IMAGE = "https://picsum.photos/1920/1080?blur=2";

const HeroSection = () => {
  const { trending, fetchTrailer } = useContext(MovieContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageError, setImageError] = useState({});

  // Select 5 random items with valid backdrop_path
  const validItems = trending.filter(
    (item) =>
      item.backdrop_path &&
      item.backdrop_path !== null &&
      typeof item.backdrop_path === "string"
  );
  const heroItems =
    validItems.length > 0
      ? validItems.sort(() => 0.5 - Math.random()).slice(0, 5)
      : [];

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (heroItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroItems.length]);

  // Handle dot click
  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  // Handle trailer button click
  const handleWatchTrailer = async (item) => {
    if (item) {
      const type = item.media_type === "movie" ? "movie" : "tv";
      const trailerUrl = await fetchTrailer(item.id, type);
      console.log(`HeroSection - Trailer URL for ${item.id}:`, trailerUrl);
      if (trailerUrl) window.open(trailerUrl, "_blank");
    }
  };

  // Handle image load errors
  const handleImageError = (itemId) => {
    setImageError((prev) => ({ ...prev, [itemId]: true }));
  };

  // Debug logs
  // console.log("Trending:", trending);
  // console.log("Hero Items:", heroItems);
  // heroItems.forEach((item) => {
  //   console.log(
  //     "Backdrop:",
  //     item.backdrop_path,
  //     "URL:",
  //     `https://image.tmdb.org/t/p/original${item.backdrop_path}`
  //   );
  // });

  if (heroItems.length === 0) {
    return (
      <div
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${FALLBACK_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-black/10 bg-opacity-50 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to CineStream
            </h1>
            <p className="text-gray-200 text-lg mb-6 line-clamp-3 max-w-2xl">
              Discover the latest movies and series.
            </p>
            <button
              disabled
              className="bg-red-500 text-white px-6 py-3 rounded-lg opacity-50 cursor-not-allowed flex items-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Watch Trailer</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[60vh] md:h-[75vh]  w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {heroItems.map((item) => (
          <div
            key={item.id}
            className="min-w-full h-[60vh] md:h-[75vh] bg-cover bg-center relative"
            style={{
              backgroundImage: `url(${
                imageError[item.id] || !item.backdrop_path
                  ? FALLBACK_IMAGE
                  : `https://image.tmdb.org/t/p/original${item.backdrop_path}`
              })`,
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
              alt="hidden"
              className="hidden"
              onError={() => handleImageError(item.id)}
            />
            <div className="absolute inset-0 bg-black/30 bg-opacity-10 flex items-center">
              <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {item.title || item.name || "Untitled"}
                </h1>
                <p className="text-gray-200 text-lg mb-6 line-clamp-3 max-w-2xl">
                  {item.overview || "No overview available."}
                </p>
                <button
                  onClick={() => handleWatchTrailer(item)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Watch Trailer</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Navigation Dots */}
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
  );
};

export default HeroSection;
