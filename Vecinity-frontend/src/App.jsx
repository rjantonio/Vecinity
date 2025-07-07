import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginScreen from "./components/LoginScreen.jsx";
import MainScreen from "./components/MainScreen.jsx";
import ErrorScreen from "./components/ErrorScreen.jsx";

function App() {
  return(
    <Routes>
      <Route path="/login" element={<LoginScreen/>}/>
      <Route path="*" element={<MainScreen/>}/>
    </Routes>
  );
}

export default App;
