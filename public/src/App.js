import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import Chat from "./pages/Chat";
import LoginPage from "./pages/LoginPage";
import SetAvatar from "./pages/SetAvatar";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Chat />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
