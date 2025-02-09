import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import { CallList, CallLogBox, Navbar } from "../components/index.ts";

function Call() {
  return (
    <div className="pr-3 h-screen w-screen flex flex-row gap-7 bg-[#E0E9F8] overflow-hidden">
      {/* Navbar */}
      <Navbar activeButton="calls" />

      {/* Page container */}
      <div className="w-full flex flex-row gap-7">
        <div className="flex flex-col gap-7">
          <div className="min-w-[30rem] max-w-[35rem] bg-white rounded-b-[2rem]">
            <div className="p-5 flex flex-col gap-7">
              <h3 className="text-[1.8rem] font-medium">Call logs</h3>
              <span className="flex gap-3 items-center justify-center">
                <Link to={""}>See All</Link>
              </span>
            </div>
          </div>

          {/* User List */}
          <div className="h-full min-w-[30rem] max-w-[35rem] bg-white rounded-t-[2rem]">
            <div className="p-7 pt-7 flex flex-col gap-4">
              <span className="relative w-full border border-[#007BFF] rounded-[2rem]">
                <span className="absolute left-3 top-3 text-[2rem]">
                  <IoIosSearch />
                </span>
                <input
                  className="w-full pr-6 pl-14 py-2 h-[50px] rounded-[2rem] focus:outline-none"
                  placeholder="Search here"
                  type="search"
                />
              </span>
              <span className="h-[72vh] overflow-y-scroll rounded-[7px]">
                <CallList />
              </span>
            </div>
          </div>
        </div>

        {/* Chat Box */}
        <CallLogBox />
      </div>
    </div>
  );
}

export default Call;
