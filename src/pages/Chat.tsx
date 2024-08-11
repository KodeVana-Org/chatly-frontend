import { CgAddR, CgProfile } from "react-icons/cg";
import { TbMessageChatbot } from "react-icons/tb";
import { IoPeopleSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import ChatList from "../components/ChatList.tsx";
import ChatBox from "../components/ChatBox.tsx";
import TextControlBox from "../components/TextControlBox.tsx";

function Chat() {
  return (
    <div className="pr-3 h-screen w-screen flex flex-row">
      <div className="h-full px-3 py-7 flex flex-col justify-between">
        <Link
          to="/"
          className="text-[30px] font-bold px-4 py-3 bg-blue-100 rounded-[10px] border-2 border-white shadow-md hover:shadow-lg"
        >
          T
        </Link>
        <span className="flex flex-col gap-3 w-full">
          <Link
            to="/chat"
            className="p-3 text-[30px] text-white bg-blue-500 rounded-[10px] border-2 border-white shadow-md hover:shadow-lg"
          >
            <TbMessageChatbot />
          </Link>
          <Link
            to="/contacts"
            className="p-3 text-[30px] bg-blue-100 rounded-[10px] border-2 border-white shadow-md hover:shadow-lg"
          >
            <IoPeopleSharp />
          </Link>
          <Link
            to="/calls"
            className="p-3 text-[25px] bg-blue-100 rounded-[10px] border-2 border-white shadow-md hover:shadow-lg"
          >
            <FaPhoneAlt />
          </Link>
        </span>
        <span className="flex flex-col gap-3 w-full">
          <Link
            to="/profile"
            className="p-3 text-[30px] bg-blue-100 rounded-[10px] border-2 border-white shadow-md hover:shadow-lg"
          >
            <CgProfile />
          </Link>
        </span>
      </div>
      <div className="w-full my-3 grid grid-cols-3 bg-blue-50 rounded-[10px] border-2 border-white shadow-md hover:shadow-lg">
        <div className="p-6 col-span-1 flex flex-col gap-4 border-r-2 border-r-slate-300">
          <button className="flex flex-row gap-2 rounded-[7px] bg-white text-right shadow-md hover:shadow-lg">
            <span className="px-5 py-3 text-[28px] border-r-2">
              <CgAddR />
            </span>
            <p className="pl-3 pr-9 my-auto">New conversation</p>
          </button>
          <span>
            <h2 className="text-[25px] font-semibold">Chats</h2>
          </span>
          <span className="relative w-full shadow-md hover:shadow-lg">
            <input
              className="w-full pl-6 pr-10 py-2 h-[50px] rounded-[7px] focus:outline-none"
              placeholder="Search here"
              type="search"
            />
            <span className="absolute right-3 top-3 text-[25px]">
              <IoIosSearch />
            </span>
          </span>
          <span className="h-[67vh] overflow-y-scroll rounded-[7px] shadow-md hover:shadow-lg">
            <ChatList />
          </span>
        </div>
        <div className="col-span-2 w-full">
          <span className="pl-9 py-3 flex flex-row gap-5 bg-white border-slate-300 border-y border-r shadow-sm rounded-tr-[7px]">
            <img
              className="h-10 w-10 rounded-[50%]"
              src="../assets/profile.png"
              alt=""
            />
            <span className="flex flex-col gap-1">
              <h4 className="font-semibold">Olive Maccy</h4>
              <p className="text-[12px] text-gray-400">Active a minute ago</p>
            </span>
          </span>
          <div className="w-full h-[88vh] flex flex-col relative justify-between">
            <ChatBox />
            <TextControlBox />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
