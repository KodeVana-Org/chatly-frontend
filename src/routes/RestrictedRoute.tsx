import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const RestrictedRoute = ({
  children,
  allowedFrom,
}: {
  children: JSX.Element;
  allowedFrom: string;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (allowedFrom !== "/signup") {
      toast.error("You are not authorized to access this page directly.");
      navigate(-1);
    }
  }, [location, navigate]);

  return allowedFrom === "/signup" ? children : null;
};

export default RestrictedRoute;
