import React from 'react';
import { Home, Info, Github } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-logo">AI Chat</span>
        </div>
        <div className="navbar-links">
          <a href="/" className="navbar-link">
            <Home size={18} />
            <span>Home</span>
          </a>
          <a href="/about" className="navbar-link">
            <Info size={18} />
            <span>About</span>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="navbar-link">
            <Github size={18} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;