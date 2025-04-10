import React from "react";
import Navbar from "../components/Home/NavBar";
import Hero from "../components/Home/Hero";
import Features from "../components/Home/Features";
import Footer from "../components/Home/Footer";

function Home() {
  return (
    <div className="flex flex-col min-h-screen justify-between bg-boxdark">
      <div>
        <Navbar />
        <Hero />
        <Features />
      </div>

      <Footer />
    </div>
  );
}

export default Home;
