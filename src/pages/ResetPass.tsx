import { verifyResetOtp, resetPassword } from "../api/index.ts";
import { LoginImg } from "../assets/index.ts";
import { validateOtp, validatePassword } from "../validators";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

function ForgotPass() {
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const { email } = location.state || {};

  // Handle set new password form accessibility
  const [verified, setVerified] = useState(false);

  // OTP input field
  const inputsRef = useRef<HTMLInputElement[]>([]);

  // Reset password field
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State to update form error
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // State for password visibility
  const [visiblePass, setVisiblePass] = useState(false);
  const togglePassVisibility = () => {
    setVisiblePass(!visiblePass);
  };

  // Handle otp verification
  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading1(true);

    // Compute OTP as a string
    const otpString = inputsRef.current.map((input) => input?.value).join("");

    // Convert OTP to a number
    const otp = parseInt(otpString, 10); // Use `+otpString` as an alternative

    if (isNaN(otp)) {
      setOtpError("Invalid OTP format. Please enter a valid numeric OTP.");
      return;
    }

    // Error state
    const [isOtpValid, otpErrorMessage] = validateOtp(otp);

    // Update error states
    setOtpError(otpErrorMessage);

    // Input field error validation
    if (isOtpValid) {
      try {
        const response = await verifyResetOtp(email, otp); // Pass `otp` as a number
        if (response.data.statusCode === 200) {
          setVerified(true);
        }
      } catch (err: any) {
        console.error("Error:", err); // TODO: handle error properly
      } finally {
        setIsLoading1(false);
      }
    }
  };

  // Handle setting new password
  const handleResetPasword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading2(true);

    //Error state
    const [isPasswordValid, passwordErrorMessage] = validatePassword(password);
    const [isConfirmPasswordValid, confirmPasswordErrorMessage] =
      validatePassword(confirmPassword);

    // Update error states
    setPasswordError(passwordErrorMessage);
    setConfirmPasswordError(confirmPasswordErrorMessage);

    // Input field error validation
    if (isPasswordValid && isConfirmPasswordValid) {
      if (password === confirmPassword) {
        try {
          const response = await resetPassword(email, password);
          if (response.data.statusCode == 200) {
            auth?.login(response); // Save user data
            navigate("/chat");
          }
        } catch (err: any) {
          console.error("Error:", err); //TODO: handle error properly
        } finally {
          setIsLoading2(false);
        }
      } else {
        setConfirmPasswordError("Password doesn't match!");
      }
    }
  };

  // OTP input field
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const key = e.key;

    // Allow only numeric input, Backspace, Delete, Tab, and Meta key
    if (
      !/^[0-9]$/.test(key) &&
      key !== "Backspace" &&
      key !== "Delete" &&
      key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    // Handle Backspace and Delete
    if (key === "Backspace" || key === "Delete") {
      e.preventDefault(); // Prevent default behavior of Backspace
      const input = inputsRef.current[index];
      if (input) input.value = ""; // Clear current input's value

      if (key === "Backspace" && index > 0) {
        const prevInput = inputsRef.current[index - 1];
        if (prevInput) prevInput.focus();
      }
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (value && /^[0-9]$/.test(value)) {
      if (index < inputsRef.current.length - 1) {
        const nextInput = inputsRef.current[index + 1];
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");

    if (!/^\d{4}$/.test(text)) return;

    const digits = text.split("");
    inputsRef.current.forEach((input, idx) => {
      if (digits[idx]) {
        input.value = digits[idx];
      }
    });

    if (inputsRef.current.length > 0) {
      inputsRef.current[inputsRef.current.length - 1]?.focus();
    }
  };

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
          <div className="flex flex-col gap-7 text-center items-center">
            <h3 className="text-5xl text-[#007BFF] font-medium">
              Set new password
            </h3>
            <p className="text-black font-medium w-[70%]">Verify OTP</p>
          </div>
          <form
            id="otp-form"
            className="w-[35rem] flex flex-col gap-7 content-center items-center"
            onSubmit={(e) => handleVerifyOtp(e)}
          >
            <div className="flex flex-col gap-2 text-center">
              <span class="w-full flex flex-row items-center justify-center gap-3">
                {[...Array(4)].map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputsRef.current[index] = el;
                    }}
                    type="text"
                    className="w-14 h-14 text-center text-black text-2xl font-extrabold bg-white appearance-none rounded p-4 outline-none hover:outline-[#007BFF] focus:outline-[#007BFF]"
                    maxLength={1}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onInput={(e) => handleInput(e, index)}
                    onFocus={handleFocus}
                    onPaste={handlePaste}
                  />
                ))}
              </span>
              <p
                className={`text-red-500 w-full ${otpError ? "block" : "hidden"}`}
              >
                {otpError}
              </p>
            </div>
            <button
              className="w-fit px-36 py-4 text-xl font-medium text-white bg-[#007BFF] hover:bg-[#026fe3] rounded-[2rem] cursor-pointer"
              type="submit"
            >
              Verify OTP
            </button>
          </form>
          <form
            className="w-[35rem] flex flex-col gap-7 content-center items-center"
            onSubmit={(e) => handleResetPasword(e)}
          >
            <p className="text-black font-medium text-center w-[70%]">
              Set new password
            </p>
            <div className="w-full flex flex-col gap-2">
              <span className="relative w-full">
                <input
                  className={`w-full m-0 pl-4 pr-12 h-16 rounded-xl text-[18px] text-black dark:text-white bg-white dark:bg-black outline-none focus:outline-[#007BFF] ${!verified ? "cursor-not-allowed" : "hover:outline-[#007BFF] cursor-text"}`}
                  type={visiblePass ? "text" : "password"}
                  placeholder="Password"
                  disabled={!verified}
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
            <div className="w-full flex flex-col gap-2">
              <span className="relative w-full">
                <input
                  className={`w-full m-0 pl-4 pr-12 h-16 rounded-xl text-[18px] text-black dark:text-white bg-white dark:bg-black outline-none focus:outline-[#007BFF] ${!verified ? "cursor-not-allowed" : "hover:outline-[#007BFF] cursor-text"}`}
                  type={visiblePass ? "text" : "password"}
                  placeholder="Confirm Password"
                  disabled={!verified}
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
            <button
              className={`w-fit px-36 py-4 text-xl font-medium text-white bg-[#007BFF] rounded-[2rem] ${!verified ? "cursor-not-allowed" : "hover:bg-[#026fe3] cursor-pointer"}`}
              type="submit"
              disabled={!verified}
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPass;
