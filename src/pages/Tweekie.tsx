import { ChatBox, Navbar } from "../components/index.ts";

function Tweekie() {
  return (
    <div className="pr-3 h-screen w-screen flex flex-row gap-7 bg-[#E0E9F8] overflow-hidden">
      {/* Navbar */}
      <Navbar activeButton="tweekie" />

      {/* Page container */}
      <div className="w-full flex flex-row gap-7">
        {/* Chat Box */}
        <ChatBox />
      </div>
    </div>
  );
}

export default Tweekie;
