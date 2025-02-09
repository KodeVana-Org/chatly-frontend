// Username validation function
export function validateUsername(username: string): [boolean, string] {
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,16}$/;
  if (!username) {
    return [false, "Username is required"];
  }

  if (!usernameRegex.test(username)) {
    return [false, "Invalid username format"];
  }

  return [true, ""];
}
