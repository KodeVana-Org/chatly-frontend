import { Logo } from "../assets/index.ts";
import { AiOutlineOpenAI } from "react-icons/ai";
import { MdMessage } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

interface NavbarProps {
  activeButton: "chat" | "calls" | "tweekie" | "settings" | "logout";
}

const Navbar: React.FC<NavbarProps> = ({ activeButton }) => {
  const auth = useAuth();
  if (!auth) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const handleLogout = () => {
    auth.logout();
  };

  const getButtonStyles = (button: string) =>
    activeButton === button
      ? "text-[#007BFF] bg-white"
      : "text-white bg-[#007BFF]";

  return (
    <div className="h-full px-4 py-7 flex flex-col items-center justify-between bg-[#007BFF]">
      <Link to="/" className="w-fit px-2 py-3 bg-white rounded-[10px]">
        <img className="w-[2.7rem]" src={Logo} />
      </Link>

      <div className="flex flex-col gap-12 text-center items-center w-full">
        <Link
          to="/chat"
          className={`p-2 w-fit text-[2.5rem] ${getButtonStyles("chat")} rounded-[10px]`}
        >
          <MdMessage />
        </Link>
        <Link
          to="/calls"
          className={`p-2 text-[2.5rem] ${getButtonStyles("calls")} rounded-[10px]`}
        >
          <FaPhoneAlt />
        </Link>
        <div className="h-0.5 w-[80%] bg-white"></div>
        <Link
          to="/tweekie"
          className={`p-2 text-[3rem] ${getButtonStyles("tweekie")} rounded-[10px]`}
        >
          <AiOutlineOpenAI />
        </Link>
      </div>

      <div className="flex flex-col gap-3 text-center items-center w-full">
        <Link
          to="/settings"
          className={`p-3 text-[3rem] ${getButtonStyles("settings")} rounded-[10px]`}
        >
          <IoSettingsOutline />
        </Link>
        <Link
          to="/login"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          className={`p-3 text-[3rem] text-red-500 ${
            activeButton === "logout" ? "bg-white" : "bg-[#007BFF]"
          } rounded-[10px]`}
        >
          <IoMdLogOut />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
