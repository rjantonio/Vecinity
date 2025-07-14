import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/LoginScreen.css';
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (user) await logout(); // Cierra sesión si ya hay usuario autenticado
      await login(email, password);
      navigate("/"); // Redirige a la lista al iniciar sesión
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="main__screen__login">
      <div className="main__content__login">
        <h1>Inicio de sesión</h1>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            className="input__login"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="input__login"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div style={{ color: "red", marginBottom: "0.5rem" }}>{error}</div>}
          <button
            className="input__login input__login__login"
            type="submit"
          >
            Iniciar sesión
          </button>
        </form>
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