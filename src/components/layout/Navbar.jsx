import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-emerald-600 p-4 text-white shadow-md">
      <div className="container mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Telecom CRM Logo" className="h-8 mr-2" />
            <span className="text-xl font-bold">Tele Link Pro</span>
          </Link>
          
          <div className="flex items-center">
            {user ? (
              <>
                <div className="mr-4 bg-emerald-700 px-3 py-1 rounded-full text-sm">
                  {user.userType}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded mr-3 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Telecom CRM Logo" className="h-7 mr-2" />
            <span className="text-lg font-bold">Tele Link Pro</span>
          </Link>

          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md bg-emerald-700 hover:bg-emerald-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-emerald-500">
            {user ? (
              <>
                <div className="bg-emerald-700 px-3 py-1 mb-3 rounded-full text-sm inline-block">
                  {user.userType}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-4 rounded mb-2 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded mb-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded mb-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;