import React, { useContext, useState } from "react";
import { MovieContext } from "../context/MovieContext";
import {
  Search,
  Home,
  Grid,
  Film,
  Tv,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const {
    setContentType,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    contentType,
  } = useContext(MovieContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", contentType: "home", icon: Home, path: "/" },
    { label: "Genre", contentType: "genre", icon: Grid, path: "/genre" },
    { label: "Series", contentType: "series", icon: Tv, path: "/series" },
    {
      label: "Animation",
      contentType: "animation",
      icon: Sparkles,
      path: "/animation",
    },
    { label: "Movies", contentType: "movies", icon: Film, path: "/movies" },
  ];

  const filterOptions = [
    { label: "Popular", value: "popular" },
    { label: "Newly Released", value: "newly-released" },
    { label: "Top Rated", value: "top-rated" },
  ];

  const handleNavClick = (newContentType, path) => {
    setContentType(newContentType);
    setFilter("popular");
    setIsMenuOpen(false);
    setShowFilterDropdown(false);
    navigate(path);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setContentType("search");
      navigate("/search");
    }
  };

  return (
    <header className="bg-black sticky top-0 z-50">
      <div className=" w-full lg:px-8 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl lg:text-2xl font-bold text-white">
              <span className="text-red-500">Ade</span>Stream
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-3 lg:space-x-5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`flex items-center space-x-1.5 px-3 py-2 text-sm lg:text-base rounded-lg transition-all duration-200 ${
                    contentType === item.contentType
                      ? "bg-red-500 text-white"
                      : "text-gray-100 hover:text-white hover:bg-gray-800"
                  }`}
                  onClick={() => handleNavClick(item.contentType, item.path)}
                >
                  <Icon className="lg:h-4 lg:w-4 h-3 w-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies, series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                className="bg-gray-800 text-white  px-2 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 max-w-40"
              />
              <Search className="absolute left-3 top-2.5 lg:h-4 lg:w-4 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block h-0.5 w-6 bg-white transition-all ${
                  isMenuOpen ? "rotate-45 translate-y-0.5" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-white mt-1 transition-all ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-white mt-1 transition-all ${
                  isMenuOpen ? "-rotate-45 -translate-y-0.5" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
            <div className="flex flex-col space-y-2 mt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      contentType === item.contentType
                        ? "bg-red-500 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                    onClick={() => handleNavClick(item.contentType, item.path)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => handleNavClick("search", "/search")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  contentType === "search"
                    ? "bg-red-500 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </div>
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search movies, series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>
        )}

        {(contentType === "movies" || contentType === "series") && (
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-gray-400">Filter:</span>
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors"
              >
                <span>
                  {filterOptions.find((f) => f.value === filter)?.label ||
                    "Popular"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-gray-800 rounded-lg shadow-lg z-10 min-w-full">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilter(option.value);
                        setShowFilterDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
