import React, { useContext, useRef } from "react";
import { MovieContext } from "../context/MovieContext";
import HeroSection from "./HeroSection";
import Content from "./Content";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Home = () => {
  const {
    trending,
    newMovies,
    newSeries,
    recommended,
    popularMovies,
    popularSeries,
    topRatedMovies,
    topRatedSeries,
    loading,
    error,
  } = useContext(MovieContext);

  const sections = [
    { title: "Trending", data: trending },
    { title: "New Release Movies", data: newMovies },
    { title: "New Release Series", data: newSeries },
    { title: "Recommended", data: recommended },
    { title: "Popular Movies", data: popularMovies },
    { title: "Popular Series", data: popularSeries },
    { title: "Top Rated Movies", data: topRatedMovies },
    { title: "Top Rated Series", data: topRatedSeries },
  ];

  // Create refs for each section at the top level
  const sliderRefs = {
    Trending: useRef(null),
    "New Release Movies": useRef(null),
    "New Release Series": useRef(null),
    Recommended: useRef(null),
    "Popular Movies": useRef(null),
    "Popular Series": useRef(null),
    "Top Rated Movies": useRef(null),
    "Top Rated Series": useRef(null),
  };

  // Scroll left or right for a given section
  const scrollSlider = (sectionTitle, direction) => {
    const slider = sliderRefs[sectionTitle].current;
    if (slider) {
      const scrollAmount = direction === "left" ? -300 : 300; // Adjust scroll distance (px)
      slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

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

  return (
    <div className="mx-auto w-full">
      <HeroSection />
      <div className=" px-4 py-8">
        {sections.map((section) => (
          <div key={section.title} className="my-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl md:text-3xl font-bold text-white">
                {section.title}
              </h2>
              {section.data.length > 0 && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => scrollSlider(section.title, "left")}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                    aria-label={`Scroll ${section.title} left`}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => scrollSlider(section.title, "right")}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                    aria-label={`Scroll ${section.title} right`}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>
            {section.data.length === 0 ? (
              <p className="text-gray-400 text-lg">No content found.</p>
            ) : (
              <div
                ref={sliderRefs[section.title]}
                className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-6 pb-4 scrollbar-hide"
              >
                {section.data.map((item) => (
                  <div key={item.id} className="flex-none w-64 snap-start">
                    <Content
                      item={item}
                      contentType={
                        item.media_type ||
                        (section.title.includes("Series") ? "series" : "movies")
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
