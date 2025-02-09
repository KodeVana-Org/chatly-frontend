import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth?.user) {
      toast.error("Not authorized to visit this page.");
      navigate(-1);
    }
  }, [auth, navigate, location]);

  return auth?.user ? children : null;
};

export default ProtectedRoute;
