import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define types
interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(() => {
    const saveUser = localStorage.getItem("user");
    return saveUser ? JSON.parse(saveUser) : null;
  });

  // Function to log in
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Function to log out
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use Auth Context
export function useAuth() {
  return useContext(AuthContext);
}
