import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-center">
      <h1 className="text-5xl font-bold mb-6" style={{ color: "#DEE4EE" }}>
        Connect Instantly with Chatly
      </h1>
      <p className="text-xl mb-8" style={{ color: "#EFF4FB" }}>
        Experience seamless communication with friends and colleagues worldwide
      </p>
      <Link
        to="/auth/login"
        className="px-8 py-3 rounded-lg text-lg font-semibold text-white bg-primary"
      >
        Start Chatting Now
      </Link>
    </section>
  );
}

export default Hero;
