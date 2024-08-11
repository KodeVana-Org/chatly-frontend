import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col">
      <span>Home</span>
      <Link to="/login">Login</Link>
      <Link to="/signup">SignUp</Link>
    </div>
  );
}

export default Home;
