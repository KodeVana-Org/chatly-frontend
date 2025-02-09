import { Link } from "react-router-dom";
import { LandingBG } from "../assets";

function Home() {
  return (
    <div className="relative w-screen h-screen">
      {/* Background Image */}
      <img className="w-full h-full object-cover" src={LandingBG} alt="" />

      {/* Centered Buttons */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
        <Link
          to="/login"
          className="w-96 px-6 py-3 text-center text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="w-96 px-6 py-3 text-center text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition"
        >
          SignUp
        </Link>
      </div>
    </div>
  );
}

export default Home;
