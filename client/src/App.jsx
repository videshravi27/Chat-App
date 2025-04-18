import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";

import { Toaster } from 'react-hot-toast';

import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";

const App = () => {
  const { checkAuth, authUser, isCheckingAuth, onlineUsers } = useAuthStore();
  console.log({ onlineUsers })

  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  console.log({authUser})

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <Toaster />
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/setting" element={authUser ? <SettingPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

      </Routes>
    </div>
  )
}
export default App