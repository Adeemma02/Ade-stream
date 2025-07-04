import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <div className="bg-black min-h-screen">
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
    </div>
  );
};

export default function AppWrapper() {
  return (
    <MovieProvider>
      <Router>
        <App />
      </Router>
    </MovieProvider>
  );
}
