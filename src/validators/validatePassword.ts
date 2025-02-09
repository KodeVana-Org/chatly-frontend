// Password validation function
export function validatePassword(password: string): [boolean, string] {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|-]).{8,}$/;

  if (!password) {
    return [false, "Password is required"];
  }

  if (!passwordRegex.test(password)) {
    return [
      false,
      "Password must be at least 8 characters long, containing at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol",
    ];
  }

  return [true, ""];
}
