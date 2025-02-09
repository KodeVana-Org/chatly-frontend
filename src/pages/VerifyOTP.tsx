import { useLocation } from "react-router-dom";
import { verifyRegisterEmail } from "../api/index.ts";
import { LoginImg } from "../assets/index.ts";
import { validateOtp } from "../validators";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

function VerifyOTP() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const { username, email, password } = location.state || {};

  // OTP input field
  const inputsRef = useRef<HTMLInputElement[]>([]);

  // State to update form error
  const [otpError, setOtpError] = useState("");

  // Handle otp verification
  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

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
        const response = await verifyRegisterEmail(
          username,
          email,
          password,
          otp,
        );
        if (response.data.statusCode === 200) {
          auth?.login(response); // Save user data
          navigate("/chat");
        }
      } catch (err: any) {
        console.error("Error:", err); // TODO: handle error properly
      } finally {
        setIsLoading(false);
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
            <h3 className="text-5xl text-[#007BFF] font-medium">Verify OTP</h3>
          </div>
          <form
            id="otp-form"
            className="w-[35rem] flex flex-col gap-7 content-center items-center"
            onSubmit={(e) => handleVerifyOtp(e)}
          >
            <div className="flex flex-col gap-2 text-center">
              <span className="w-full flex flex-row items-center justify-center gap-3">
                {[...Array(4)].map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputsRef.current[index] = el;
                    }}
                    type="text"
                    className="w-14 h-14 text-center text-black dark:text-black text-2xl font-extrabold bg-white appearance-none rounded p-4 outline-none hover:outline-[#007BFF] focus:outline-[#007BFF]"
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
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
