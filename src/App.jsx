import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Movies from "./components/Movies";
import Series from "./components/Series";
import Animation from "./components/Animation";
import Genre from "./components/Genre";
import Search from "./components/Search";
import { MovieProvider } from "./context/MovieProvider";
import "./App.css";

// Scroll to Top Button Component
const ScrollToTopButton = React.memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    setIsVisible(window.scrollY > 300);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [toggleVisibility]);

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200 z-50"
        aria-label="Scroll to top"
      >
        ↑
      </button>
    )
  );
});

// Scroll to Top on Route Change
const ScrollOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/animation" element={<Animation />} />
          <Route path="/genre" element={<Genre />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

const AppWrapper = () => {
  return (
    <MovieProvider>
      <Router>
        <ScrollOnRouteChange />
        <App />
      </Router>
    </MovieProvider>
  );
};

export default React.memo(AppWrapper);
