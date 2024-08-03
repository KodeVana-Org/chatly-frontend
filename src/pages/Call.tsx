import { CgAddR, CgProfile } from "react-icons/cg";
import { BsFillTelephonePlusFill } from "react-icons/bs";
import { TbMessageChatbot } from "react-icons/tb";
import { IoSettingsSharp, IoPeopleSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import CallList from "../components/CallList.tsx";

function Call() {
  return (
    <div className="pr-3 h-screen w-screen flex flex-row">
      <div className="h-full px-3 py-7 flex flex-col justify-between">
        <span className="text-[30px] font-semibold px-4 py-3 bg-blue-100 rounded-[10px] border-2 border-white shadow-md hover:shadow-lg">
          T
        </span>
        <span className="flex flex-col gap-3 w-full">
          <Link
            to="/chat"
            className="p-3 text-[30px] bg-blue-100 rounded-[10px] border-2 border-white shadow-md hover:shadow-lg"
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
            to="/settings"
            className="p-3 text-[30px] bg-blue-100 rounded-[10px] border-2 border-white shadow-md hover:shadow-lg"
          >
            <IoSettingsSharp />
          </Link>
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
          <span>
            <h2 className="text-[25px] font-semibold">Call logs</h2>
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
          <span className="h-[76vh] overflow-y-scroll rounded-[7px] shadow-md hover:shadow-lg">
            <CallList />
          </span>
        </div>
        <div className="col-span-2 w-full">Hello</div>
      </div>
    </div>
  );
}

export default Call;
