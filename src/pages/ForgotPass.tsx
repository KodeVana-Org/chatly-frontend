import { forgotPassword } from "../api/index.ts";
import { validateEmail } from "../validators";
import { useGoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginImg, Google } from "../assets";

function ForgotPass() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // State for email
  const [email, setEmail] = useState("");

  // State to update form error
  const [emailError, setEmailError] = useState("");

  // State for password visibility
  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    //Error state
    const [isEmailValid, emailErrorMessage] = validateEmail(email);

    // Update error states
    setEmailError(emailErrorMessage);

    if (isEmailValid) {
      try {
        const response = await forgotPassword(email);
        if (response.data.statusCode == 200) {
          navigate("/setpassword", {
            state: {
              email: email,
            },
          });
        }
      } catch (err: any) {
        console.error("Error:", err); //TODO: handle error properly
      } finally {
        setIsLoading(false);
      }
    }
  };

  //TODO: Update user data in the context

  // Login with Google
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });

  return (
    <div className="relative">
      <div className="relative">
        <img
          className="w-screen min-h-screen max-h-[55rem] object-cover"
          src={LoginImg}
          alt=""
        />
      </div>
      <div className="mx-72 my-12 absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-blue-50 bg-opacity-70 rounded-3xl border-2 border-white">
        <form
          className="flex flex-col gap-12"
          onSubmit={(e) => handleSendOtp(e)}
        >
          <div className="flex flex-col gap-7 text-center items-center">
            <h3 className="text-5xl text-[#007BFF] font-medium">
              Reset login password
            </h3>
            <p className="text-black font-medium w-[70%]">
              Fill your information below to reset your account password
            </p>
          </div>
          <div className="w-[35rem] flex flex-col gap-2">
            <input
              className="px-4 py-2 h-16 w-full rounded-xl text-[18px] bg-white dark:bg-black text-black dark:text-white outline-none hover:outline-[#007BFF] focus:outline-[#007BFF]"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p
              className={`text-red-500 w-full ${emailError ? "block" : "hidden"}`}
            >
              {emailError}
            </p>
          </div>
          <div className="flex flex-col gap-5 content-center items-center">
            <button
              className="w-fit px-36 py-4 text-xl font-medium text-white bg-[#007BFF] hover:bg-[#026fe3] rounded-[2rem] cursor-pointer"
              type="submit"
            >
              Get OTP
            </button>
            <span className="flex flex-col gap-5 content-center items-center">
              <p className="text-black text-[18px]">Or sign in using</p>
              <button
                onClick={googleLogin}
                className="rounded-[50%] bg-white cursor-pointer"
              >
                <img className="w-12 p-1 aspect-square" src={Google} alt="" />
              </button>
            </span>
            <span className="flex gap-2 text-[18px]">
              <p className="text-black">Don't have an account?</p>
              <Link className="text-[#007BFF] cursor-pointer" to={"/signup"}>
                Singup
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPass;
