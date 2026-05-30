import { useState } from 'react';

export default function Header({ onBookingClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Add scroll listener
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setHasScrolled(window.scrollY > 0);
    });
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow ${
        hasScrolled ? 'shadow-sm border-b border-slate-200' : ''
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <h3 className="text-xl font-semibold text-slate-900">Raj Consulting</h3>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('home')}
            className="text-slate-700 hover:text-slate-900 text-sm font-medium transition"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-slate-700 hover:text-slate-900 text-sm font-medium transition"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className="text-slate-700 hover:text-slate-900 text-sm font-medium transition"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-slate-700 hover:text-slate-900 text-sm font-medium transition"
          >
            Contact
          </button>
        </div>

        {/* Book Now Button */}
        <button
          onClick={onBookingClick}
          className="bg-slate-900 text-white px-6 py-2 rounded-md hover:bg-slate-800 text-sm font-medium transition"
        >
          Book Now
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden ml-4 text-slate-900"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left text-slate-700 hover:text-slate-900 py-2 text-sm font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left text-slate-700 hover:text-slate-900 py-2 text-sm font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="block w-full text-left text-slate-700 hover:text-slate-900 py-2 text-sm font-medium"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left text-slate-700 hover:text-slate-900 py-2 text-sm font-medium"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
