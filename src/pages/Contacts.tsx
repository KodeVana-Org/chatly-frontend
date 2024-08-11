import { CgProfile } from "react-icons/cg";
import { TbMessageChatbot } from "react-icons/tb";
import { IoPeopleSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function Contacts() {
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
            className="p-3 text-[30px] bg-blue-100 rounded-[10px] border-2 border-white shadow-md hover:shadow-lg"
          >
            <TbMessageChatbot />
          </Link>
          <Link
            to="/contacts"
            className="p-3 text-[30px] text-white bg-blue-500 rounded-[10px] border-2 border-white shadow-md hover:shadow-lg"
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
        <div className="p-6 col-span-1 flex flex-col gap-4 border-r-2 border-r-slate-300"></div>
      </div>
    </div>
  );
}

export default Contacts;
