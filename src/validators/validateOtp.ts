// Otp validation function
export function validateOtp(otp: number): [boolean, string] {
  const otpRegex = /^\d{4}$/;
  if (!otp) {
    return [false, "Otp can't be empty"];
  }

  if (!otpRegex.test(otp.toString())) {
    return [false, "Invalid otp"];
  }

  return [true, ""];
}
