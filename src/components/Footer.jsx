import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left">
          <p className="text-sm">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            Contact Us
          </a>
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
