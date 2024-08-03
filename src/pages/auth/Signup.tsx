import { LoginImg } from "../../assets";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

function SignUp() {
  const [visiblePass, setVisiblePass] = useState(false);
  const togglePassVisibility = () => {
    setVisiblePass(!visiblePass);
  };

  return (
    <div className="mx-40 my-10 grid grid-cols-2 content-center justify-center text-center shadow-md hover:shadow-lg rounded-[25px]">
      <div className="rounded-l-[20px] border-y-[2px] border-l-[2px] border-white">
        <img className="h-full w-full rounded-l-[20px]" src={LoginImg} alt="" />
      </div>

      <div className="p-20 w-full justify-start text-left bg-blue-50 rounded-r-[20px] border-y-[2px] border-r-[2px] border-white">
        <h1 className="mb-3 text-[48px] font-semibold">SignUp</h1>
        <p className="mb-7 text-[20] text-slate-500">Create an Account</p>
        <div className="my-5 flex flex-col gap-3">
          <label className="h-fit text-[20]" htmlFor="">
            Full name
          </label>
          <input
            placeholder="John Doe"
            className="m-0 p-2 h-[40px] rounded-[7px] border border-white hover:border-blue-500"
            required
            type="text"
          />
        </div>
        <div className="my-5 flex flex-col gap-3">
          <label className="h-fit text-[20]" htmlFor="">
            Email
          </label>
          <input
            placeholder="johndoe@mail.com"
            className="m-0 p-2 h-[40px] rounded-[7px] border border-white hover:border-blue-500"
            required
            type="text"
          />
        </div>
        <div className="w-full my-5 flex flex-col gap-3">
          <label className="h-fit text-[20]" htmlFor="">
            Password
          </label>
          <span className="relative w-full">
            <input
              className="w-full m-0 pl-2 pr-10 h-[40px] rounded-[7px] border border-white hover:border-blue-500"
              required
              type={visiblePass ? "text" : "password"}
            />
            <button
              onClick={togglePassVisibility}
              className="p-1 absolute right-3 top-2 text-[20px]"
            >
              {visiblePass ? <FaEye /> : <FaEyeSlash />}
            </button>
          </span>
        </div>
        <div className="mx-5 flex flex-row justify-between">
          <span className="flex flex-row gap-2">
            <input className="cursor-pointer" type="checkbox" />
            <p></p>Accept privacy policy
          </span>
        </div>
        <div className="my-5 w-full justify-center text-center content-center">
          <button className="my-5 p-5 w-2/4 hover:text-white bg-white hover:bg-[#6893FF] border-2 border-blue-100 hover:border-white rounded-[10px] text-[36] font-semibold cursor-pointer">
            SignUp
          </button>
        </div>
        <div className="flex flex-row gap-4 justify-center text-center content-center">
          <p>Already have an account?</p>
          <Link
            to="/login"
            className="text-[#6893FF] hover:text-blue-500 font-semibold cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
