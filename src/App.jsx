import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { MovieProvider } from "./context/MovieProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

// Lazy load pages
const Home = lazy(() => import("./components/Home"));
const Movies = lazy(() => import("./components/Movies"));
const Series = lazy(() => import("./components/Series"));
const Animation = lazy(() => import("./components/Animation"));
const Genre = lazy(() => import("./components/Genre"));
const Search = lazy(() => import("./components/Search"));

// Automatically scroll to top on route change
const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="text-white text-center py-10">Loading...</div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/series" element={<Series />} />
            <Route path="/animation" element={<Animation />} />
            <Route path="/genre" element={<Genre />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

const AppWrapper = () => {
  return (
    <MovieProvider>
      <Router>
        <ScrollToTopOnRouteChange />
        <App />
      </Router>
    </MovieProvider>
  );
};

export default React.memo(AppWrapper);
