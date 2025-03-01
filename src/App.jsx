import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Messages from "./pages/Messages";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Verification from "./pages/auth/Verification";
import Layout from "./layout";
import CallPage from "./pages/CallPage";
import AiPage from "./pages/AiPage";
import ToonifyPage from "./pages/ToonifyPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  useEffect(() => {
    const colorMode = JSON.parse(window.localStorage.getItem("color-theme"));

    const className = "dark";

    const bodyClass = window.document.body.classList;

    colorMode === "dark"
      ? bodyClass.add(className)
      : bodyClass.remove(className);
  }, []);

  return (
    <Routes>
      {/* Redirect / to /auth/login */}

      <Route path="/" element={<Navigate to="/auth/login" />} />

      {/* <Route index={true} element={<Messages />} /> */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/auth/verify" element={<Verification />} />

      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Messages />} />

        <Route path="calls" element={<CallPage />} />
        <Route path="ai" element={<AiPage />} />
        <Route path="toonify" element={<ToonifyPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
