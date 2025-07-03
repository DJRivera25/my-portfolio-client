import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import About from "./components/About";
import Projects from "./components/Projects";
import Tools from "./components/Tools";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import Login from "./pages/Login"; // 👈 Make sure this file exists

const HomePage = () => (
  <>
    <Navbar />
    <Landing />
    <About />
    <Projects />
    <Tools />
    <Contact />
    <Footer />
  </>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="font-[Montserrat]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<div className="text-center mt-20 text-white">404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
