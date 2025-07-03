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
import Inbox from "./pages/Inbox"; // 👈 Make sure this file exists

import ProtectedRoute from "./components/ProtectedRoute";

const HomePage = () => (
  <>
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
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <Inbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <>
                <section id="landing" className="min-h-screen flex flex-col justify-center items-center text-white">
                  <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                  <p className="text-white/70 mb-8">Oops! The page you're looking for doesn't exist.</p>
                  <a
                    href="/"
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded shadow transition"
                  >
                    Go Back Home
                  </a>
                </section>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
