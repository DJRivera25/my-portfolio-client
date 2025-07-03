import React, { useEffect, useState } from "react";
import { Link } from "react-scroll";
import myPhoto from "../images/my-photo.png";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navLinks = [
    { to: "landing", label: "Home" },
    { to: "about", label: "About" },
    { to: "projects", label: "Projects" },
    { to: "tools", label: "Tools" },
    { to: "contact", label: "Contact" },
  ];

  const handleToggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur-lg text-white shadow-lg">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <a href={isLoggedIn ? "/" : "/login"}>
            <img
              src={myPhoto}
              alt="DJR"
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-600 shadow-md cursor-pointer hover:opacity-80 transition"
            />
          </a>
          <a href="#landing" className="text-xl font-bold tracking-wide text-white hover:text-blue-400 transition">
            DJR
          </a>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex gap-8 font-medium text-sm tracking-wide uppercase items-center">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} smooth duration={500} className="cursor-pointer hover:text-blue-400 transition-colors">
                {label}
              </Link>
            </li>
          ))}

          {/* Show logout only when logged in */}
          {isLoggedIn && (
            <li>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded text-white text-xs font-medium"
              >
                Logout
              </button>
            </li>
          )}
        </ul>

        {/* Mobile Toggle */}
        <div className="lg:hidden">
          <button onClick={handleToggle} className="text-white focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-black/90 backdrop-blur-md px-6 py-4">
          <ul className="flex flex-col gap-4 text-white uppercase text-sm font-medium">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  smooth
                  duration={500}
                  onClick={closeMenu}
                  className="block py-2 border-b border-white/10 hover:text-blue-400 transition"
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Mobile Logout */}
            {isLoggedIn && (
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="block w-full text-left py-2 text-red-400 hover:text-red-300 border-t border-white/10 mt-2"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
