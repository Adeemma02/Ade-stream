import React, { useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import HeroSection from "./HeroSection";
import Content from "./Content";

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
    <div className="mx-auto w-full ">
      <HeroSection />
      <div className="container px-4 py-8">
        {sections.map((section) => (
          <div key={section.title} className="my-12">
            <h2 className="text-3xl font-bold text-white mb-8">
              {section.title}
            </h2>
            {section.data.length === 0 ? (
              <p className="text-gray-400 text-lg">No content found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {section.data.map((item) => (
                  <Content
                    key={item.id}
                    item={item}
                    contentType={
                      item.media_type ||
                      (section.title.includes("Series") ? "series" : "movies")
                    }
                  />
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
