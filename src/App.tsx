import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./pages/auth/Login.tsx";
import SignUp from "./pages/auth/Signup.tsx";
import ForgotPass from "./pages/auth/ForgotPass.tsx";
import Chat from "./pages/Chat.tsx";
import Call from "./pages/Call.tsx";
import Notfound from "./pages/Notfound.tsx";
import Contacts from "./pages/Contacts.tsx";
import Settings from "./pages/Settings.tsx";
import Profile from "./pages/Profile.tsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/calls" element={<Call />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          //Protected routes
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resetpassword" element={<ForgotPass />} />
          //Not found
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
