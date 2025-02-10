import { Profile } from "../assets/index.ts";

function CallLogBox() {
  return (
    <div className="mt-7 p-7 w-full flex flex-col gap-7 bg-white dark:bg-black rounded-t-[2rem]">
      <h3 className="text-[1.5rem]">Call info</h3>
      <div className="w-full flex flex-col border border-[#007BFF] rounded-[2rem]">
        <div className="p-5 flex justify-between">
          <span className="flex gap-5 items-center">
            <img src={Profile} alt="" />
            <p className="text-xl">Ronny Smith</p>
          </span>
          <span className="px-7 flex gap-7 items-center">
            <button>Direct Message</button>
            <button>Call</button>
          </span>
        </div>
        <div className="p-7 flex flex-col gap-5 border-t border-[#007BFF]">
          <p className="text-[1rem]">Yesterday</p>
          <div className="flex justify-between text-gray-500">
            <p className="text-[0.8rem]">Incoming call at 11:12 am</p>
            <p className="text-[0.8rem]">12 minutes and 13 seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallLogBox;
