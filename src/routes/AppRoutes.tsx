import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import RestrictedRoute from "./RestrictedRoute";
import {
  Login,
  SignUp,
  ForgotPass,
  ResetPass,
  VerifyOTP,
  Home,
  CallLog,
  Chat,
  Tweekie,
  Profile,
  Settings,
  NotFound,
} from "../pages";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route
        path="/forgotpassword"
        element={
          <PublicRoute>
            <ForgotPass />
          </PublicRoute>
        }
      />

      {/* Restricted Routes */}
      <Route
        path="/verify-otp"
        element={
          <RestrictedRoute allowedFrom="/signup">
            <VerifyOTP />
          </RestrictedRoute>
        }
      />
      <Route
        path="/setpassword"
        element={
          <RestrictedRoute allowedFrom="/forgotpassword">
            <ResetPass />
          </RestrictedRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calls"
        element={
          <ProtectedRoute>
            <CallLog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tweekie"
        element={
          <ProtectedRoute>
            <Tweekie />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
