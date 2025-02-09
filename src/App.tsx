import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId="773645138871-chf72vm6q1ssqru4b8innvfiectui5b8.apps.googleusercontent.com ">
        <ChatProvider>
          <Router>
            <AppRoutes />
          </Router>
          <ToastContainer position="top-right" autoClose={3000} />
        </ChatProvider>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}

export default App;
