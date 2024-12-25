// Header.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-black bg-opacity-80 py-4 sticky top-0 z-50 pl-calc-full">
      {/* Added sticky and z-50 */}
      <nav className="max-w-4xl mx-auto flex justify-center space-x-10">
        <Link to="/" className="text-white text-lg hover:underline">
          Home
        </Link>
        <Link to="/editor" className="text-white text-lg hover:underline">
          Editor
        </Link>
        <Link to="/profile" className="text-white text-lg hover:underline">
          Profile
        </Link>
        <Link to="/article" className="text-white text-lg hover:underline">
          Article
        </Link>
      </nav>
    </header>
  );
}
