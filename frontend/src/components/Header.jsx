// Header.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-black bg-opacity-80 py-4 sticky top-0 z-50 pl-calc-full">
      <nav className="max-w-4xl mx-auto flex justify-center space-x-10">
        <Link to="/" className="text-white text-lg hover:underline">
          Home
        </Link>
        <Link to="/articles" className="text-white text-lg hover:underline">
          Articles
        </Link>
        <Link to="/editor" className="text-white text-lg hover:underline">
          Editor
        </Link>
        <Link to="/profile" className="text-white text-lg hover:underline">
          Profile
        </Link>
        {/* a divider line */}
        <div className=" min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-400 to-transparent opacity-25"></div>
        <Link
          to="/suggested/all"
          className="text-white text-lg hover:underline"
        >
          Suggested(all)
        </Link>
      </nav>
    </header>
  );
}
