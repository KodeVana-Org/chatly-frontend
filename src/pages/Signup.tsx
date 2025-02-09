import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import { registerUser } from "../api";
import { LoginImg, Google } from "../assets";
import {
  validateUsername,
  validateEmail,
  validatePassword,
} from "../validators";
import { useAuth } from "../context/AuthContext.tsx";

function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  // State for email and password
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tAndC, setTandC] = useState(false);

  // State to update form error
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [tAndCError, setTAndCError] = useState("");

  // State for password visibility
  const [visiblePass, setVisiblePass] = useState(false);
  const togglePassVisibility = () => {
    setVisiblePass(!visiblePass);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    //Error state
    const [isUsernameValid, usernameErrorMessage] = validateUsername(username);
    const [isEmailValid, emailErrorMessage] = validateEmail(email);
    const [isPasswordValid, passwordErrorMessage] = validatePassword(password);
    const [isConfirmPasswordValid, confirmPasswordErrorMessage] =
      validatePassword(confirmPassword);

    // Update error states
    setUsernameError(usernameErrorMessage);
    setEmailError(emailErrorMessage);
    setPasswordError(passwordErrorMessage);
    setConfirmPasswordError(confirmPasswordErrorMessage);

    // Input field error validation
    if (
      isUsernameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      if (password === confirmPassword) {
        if (tAndC) {
          try {
            const response = await registerUser(email);
            if (response.data.statusCode == 200) {
              navigate("/verify-otp", {
                state: {
                  username: username,
                  email: email,
                  password: password,
                },
              });
            }
          } catch (err: any) {
            console.error("Error:", err); //TODO: handle error properly
          } finally {
            setIsLoading(false);
          }
        } else {
          // Show message to tick
          setTAndCError("Check this box to continue");
        }
      } else {
        setConfirmPasswordError("Password doesn't match!");
      }
    }
  };

  // Login with Google
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });

  return (
    <div className="relative">
      <div className="relative">
        <img
          className="w-screen min-h-screen max-h-[70rem] object-cover"
          src={LoginImg}
          alt=""
        />
      </div>
      <div className="mx-72 my-12 absolute inset-0 flex flex-col gap-12 items-center justify-center backdrop-blur-sm bg-blue-50 bg-opacity-70 rounded-3xl border-2 border-white">
        <form
          className="flex flex-col gap-12 items-center"
          onSubmit={(e) => handleSignup(e)}
        >
          <div className="flex flex-col gap-7 text-center items-center">
            <h3 className="text-5xl text-[#007BFF] font-medium">
              Create Account
            </h3>
            <p className="font-medium w-[70%] text-black">
              Fill your information below to register with your social accounts
            </p>
          </div>
          <div className="w-[35rem] flex flex-col gap-7 items-center">
            {/* Username Input */}
            <div className="flex flex-col gap-2 w-full">
              <input
                className="px-4 py-2 h-16 w-full rounded-xl text-[18px] bg-white dark:bg-black text-black dark:text-white outline-none hover:outline-[#007BFF] focus:outline-[#007BFF]"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <p
                className={`text-red-500 w-full ${usernameError ? "block" : "hidden"}`}
              >
                {usernameError}
              </p>
            </div>
            {/* Email Input */}
            <div className="flex flex-col gap-2 w-full">
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
            {/* Password Input */}
            <div className="flex flex-col gap-2 w-full">
              <span className="relative w-full">
                <input
                  className="w-full m-0 pl-4 pr-12 h-16 rounded-xl text-[18px] bg-white dark:bg-black text-black dark:text-white outline-none hover:outline-[#007BFF] focus:outline-[#007BFF]"
                  type={visiblePass ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  onClick={togglePassVisibility}
                  type="button"
                  className="p-1 absolute right-4 top-4 text-[20px]"
                >
                  {visiblePass ? <FaEye /> : <FaEyeSlash />}
                </button>
              </span>
              <p
                className={`text-red-500 w-full ${passwordError ? "block" : "hidden"}`}
              >
                {passwordError}
              </p>
            </div>
            {/* Confirm Password Input */}
            <div className="flex flex-col gap-2 w-full">
              <span className="relative w-full">
                <input
                  className="w-full m-0 pl-4 pr-12 h-16 rounded-xl text-[18px] bg-white dark:bg-black text-black dark:text-white outline-none hover:outline-[#007BFF] focus:outline-[#007BFF]"
                  type={visiblePass ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  onClick={togglePassVisibility}
                  type="button"
                  className="p-1 absolute right-4 top-4 text-[20px]"
                >
                  {visiblePass ? <FaEye /> : <FaEyeSlash />}
                </button>
              </span>
              <p
                className={`text-red-500 w-full ${confirmPasswordError ? "block" : "hidden"}`}
              >
                {confirmPasswordError}
              </p>
            </div>
            {/* Terms and Condition Input */}
            <div className="flex flex-col gap-2 w-full">
              <span className="flex gap-5 content-center items-center">
                <input
                  className="appearance-none w-6 h-6 bg-white dark:bg-black rounded-md checked:bg-blue-500 focus:outline-none cursor-pointer"
                  type="checkbox"
                  checked={tAndC}
                  onChange={(e) => setTandC(e.target.checked)}
                />
                <span className="flex text-black">
                  <p className="text-[16px]">Agree all&nbsp;</p>
                  <Link className="hover:text-[#007BFF]" to={"/t&c"}>
                    terms and conditions
                  </Link>
                </span>
              </span>
              <p
                className={`text-red-500 w-full ${tAndCError ? "block" : "hidden"}`}
              >
                {tAndCError}
              </p>
            </div>
            <button
              className="w-fit px-36 py-4 text-xl font-medium text-white bg-[#007BFF] hover:bg-[#026fe3] rounded-[2rem] cursor-pointer"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="flex flex-col gap-5 content-center items-center">
          <span className="flex flex-col gap-5 content-center items-center">
            <p className="text-[18px] text-black">OR</p>
            <button
              onClick={googleLogin}
              className="rounded-[50%] bg-white cursor-pointer"
            >
              <img className="w-12 p-1 aspect-square" src={Google} alt="" />
            </button>
          </span>
          <span className="flex gap-2 text-[18px]">
            <p className="text-black">Already have an account?</p>
            <Link className="text-[#007BFF] cursor-pointer" to={"/login"}>
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
