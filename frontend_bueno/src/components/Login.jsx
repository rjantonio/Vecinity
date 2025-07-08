import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/LoginScreen.css';
import MainScreen from "../MainScreen";

function Login() {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
  
    if (loggedIn) {
      return <MainScreen/>
    }
  
    return (
      <div className="main__screen__login">
        <div className="main__content__login">
          <input
            className="input__login"
            type="email"
            placeholder="Correo electrónico"/>
          <input
            className="input__login"
            type="password"
            placeholder="Contraseña"/>
          <button
            className="input__login input__login__login"
            //onClick={() => setLoggedIn(true)}
            onClick={() => navigate("/")}
          >
            Iniciar sesión
          </button>
          <button
            className="input__login input__login__register"
            onClick={() => navigate("/register")}
          >
            Registrarte
          </button>
        </div>
      </div>
    );
  }
  
  export default Login;