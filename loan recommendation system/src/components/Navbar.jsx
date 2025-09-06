import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUniversity } from 'react-icons/fa';

const navLinks = [
  { id: 'home', title: 'Home', path: '/' },
  { id: 'loan-recommendation', title: 'Loan Recommendation', path: '/loan-form' },
  { id: 'calculator', title: 'EMI-Calculator', path: '/calculator' },
  { id: 'features', title: 'Features', path: '/features' },
  { id: 'predict-loan', title: 'Predict Loan', path: '/predict-loan' },
  { id: 'about', title: 'About', path: '/about' },
  { id: 'contact', title: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <FaUniversity className="text-white text-lg" />
            </div>
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
              onClick={closeMenu}
            >
              SmartLoan
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ id, title, path }) => (
              <Link
                key={id}
                to={path}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive(path)
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-700 hover:text-blue-600'
                } group`}
              >
                {title}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 ${
                  isActive(path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
            
            
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-300"
              aria-expanded={isOpen}
              aria-label="Toggle main menu"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
          {navLinks.map(({ id, title, path }) => (
            <Link
              key={id}
              to={path}
              onClick={closeMenu}
              className={`block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 ${
                isActive(path)
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {title}
            </Link>
          ))}
          
       
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
