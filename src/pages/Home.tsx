import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col">
      <span>Home</span>
      <Link to="/chat">Chat</Link>
    </div>
  );
}

export default Home;
