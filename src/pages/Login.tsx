import { useState } from "react";
import ReactLoading from "react-loading";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { loginUser } from "../api";
import { LoginImg, Google } from "../assets";
import { validateEmail, validatePassword } from "../validators";
import { useAuth } from "../context/AuthContext.tsx";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  // State for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State to update form error
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // State for password visibility
  const [visiblePass, setVisiblePass] = useState(false);
  const togglePassVisibility = () => {
    setVisiblePass(!visiblePass);
  };

  // Handle login operation
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    //Error state
    const [isEmailValid, emailErrorMessage] = validateEmail(email);
    const [isPasswordValid, passwordErrorMessage] = validatePassword(password);

    // Update error states
    setEmailError(emailErrorMessage);
    setPasswordError(passwordErrorMessage);

    // Input field error validation
    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);
      try {
        const response = await loginUser(email, password);
        if (response.data.statusCode == 200) {
          auth?.login(response.data.data?.loggedInUser);
          navigate("/chat");
        }
      } catch (err: any) {
        console.error("Error:", err);
        toast.error(
          err.response?.data?.message || "Login failed. Please try again.",
        );
        if (err.response?.data?.message) {
          setEmailError(err.response.data.message);
        } else {
          setEmailError("Login failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
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
          className="w-screen min-h-screen max-h-[60rem] object-cover"
          src={LoginImg}
          alt=""
        />
      </div>
      <div className="mx-72 my-12 absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-blue-50 bg-opacity-70 rounded-3xl border-2 border-white">
        <div className="flex flex-col gap-12">
          <form
            className="flex flex-col gap-12 items-center"
            onSubmit={(e) => handleLogin(e)}
          >
            <div className="flex flex-col gap-7 text-center items-center">
              <h3 className="text-5xl text-[#007BFF] font-medium">Login</h3>
              <p className="text-black font-medium">Hi! welcome to Tawk</p>
            </div>
            <div className="w-[35rem] flex flex-col gap-7">
              {/* Email Input */}
              <div className="flex flex-col gap-2">
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
              <div className="flex flex-col gap-2">
                <span className="relative w-full">
                  <input
                    className="px-4 py-2 h-16 w-full rounded-xl text-[18px] bg-white dark:bg-black text-black dark:text-white outline-none hover:outline-[#007BFF] focus:outline-[#007BFF]"
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
              <Link
                className="w-fit text-right text-black text-[18px] hover:text-[#026fe3] cursor-pointer"
                to={"/forgotpassword"}
              >
                Forgot password?
              </Link>
            </div>

            {isLoading ? (
              <span className="pb-10">
                <ReactLoading
                  type={"balls"}
                  color={"#000"}
                  height={20}
                  width={100}
                />
              </span>
            ) : (
              <button
                className="w-fit px-36 py-4 text-xl font-medium text-white items-center bg-[#007BFF] hover:bg-[#026fe3] rounded-[2rem] cursor-pointer"
                type="submit"
              >
                Login
              </button>
            )}
          </form>
          <div className="flex flex-col gap-5 content-center items-center">
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
        </div>
      </div>
    </div>
  );
}

export default Login;
