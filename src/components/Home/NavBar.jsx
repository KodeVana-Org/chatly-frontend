import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-form-input px-6 py-6 shadow-lg border-b border-strokedark">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Chatly</h1>
        <div className="space-x-4">
          <Link
            to="/auth/login"
            className="px-4 py-2 rounded-lg font-medium text-white bg-primary"
          >
            Login
          </Link>
          <Link
            to="/auth/signup"
            className="px-4 py-2 rounded-lg font-medium border border-primary text-primary"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
