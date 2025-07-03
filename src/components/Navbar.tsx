import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 👈 Use your auth context
import myPhoto from "../images/my-photo.png";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, unseenCount, logout } = useAuth(); // 👈 From context
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const navLinks = [
    { to: "landing", label: "Home" },
    { to: "about", label: "About" },
    { to: "projects", label: "Projects" },
    { to: "resume", label: "Resume" },
    { to: "tools", label: "Tools" },
    { to: "contact", label: "Contact" },
  ];

  const handleToggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout(); // 👈 Use context logout
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur-lg text-white shadow-lg">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <RouterLink to={isLoggedIn ? "/" : "/login"}>
            <img
              src={myPhoto}
              alt="DJR"
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-600 shadow-md cursor-pointer hover:opacity-80 transition"
            />
          </RouterLink>
          <RouterLink to="/" className="text-xl font-bold tracking-wide text-white hover:text-blue-400 transition">
            DJR
          </RouterLink>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex gap-8 font-medium text-sm tracking-wide uppercase items-center">
          {isHomePage &&
            navLinks.map(({ to, label }) => (
              <li key={to}>
                <ScrollLink
                  to={to}
                  smooth
                  duration={500}
                  className="cursor-pointer hover:text-blue-400 transition-colors"
                >
                  {label}
                </ScrollLink>
              </li>
            ))}

          {!isHomePage && (
            <li>
              <RouterLink to="/" className="cursor-pointer hover:text-blue-400 transition-colors">
                Home
              </RouterLink>
            </li>
          )}

          {isLoggedIn && (
            <li>
              <button
                onClick={() => navigate("/inbox")}
                className="relative px-3 py-1 hover:text-yellow-400 transition"
              >
                INBOX
                {unseenCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-xs px-1.5 py-0.5 rounded-full font-bold">
                    {unseenCount}
                  </span>
                )}
              </button>
            </li>
          )}

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
            {isHomePage &&
              navLinks.map(({ to, label }) => (
                <li key={to}>
                  <ScrollLink
                    to={to}
                    smooth
                    duration={500}
                    onClick={closeMenu}
                    className="block py-2 border-b border-white/10 hover:text-blue-400 transition"
                  >
                    {label}
                  </ScrollLink>
                </li>
              ))}

            {!isHomePage && (
              <li>
                <RouterLink
                  to="/"
                  onClick={closeMenu}
                  className="block py-2 border-b border-white/10 hover:text-blue-400 transition"
                >
                  Home
                </RouterLink>
              </li>
            )}

            {isLoggedIn && (
              <>
                <li>
                  <button
                    onClick={() => {
                      navigate("/inbox");
                      closeMenu();
                    }}
                    className="flex items-center justify-between w-full py-2 border-b border-white/10 hover:text-yellow-400"
                  >
                    INBOX
                    {unseenCount > 0 && (
                      <span className="bg-red-600 text-xs px-1.5 py-0.5 rounded-full font-bold">{unseenCount}</span>
                    )}
                  </button>
                </li>

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
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
