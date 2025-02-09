// Email validation function
export function validateEmail(email: string): [boolean, string] {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return [false, "Email is required"];
  }

  if (!emailRegex.test(email)) {
    return [false, "Invalid email format"];
  }

  return [true, ""];
}
