import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./home";
import Signup from "./signup";
import Login from "./login";
import Modify from "./modify";
import View from "./view";
import DefaultLayout from "../layouts/DefaultLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import Profile from "./profile";

function App() {
  return (
    <>
      <Routes>
        {/* Default Layout Routes */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Signup />} />
        </Route>

        {/* Protected Layout Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/modify" element={<Modify />} />
          <Route path="/view" element={<View />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
