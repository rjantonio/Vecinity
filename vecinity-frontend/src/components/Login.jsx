import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/LoginScreen.css';
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth(); // solo login aquí
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // 1. Login con Firebase
      const userCredential = await login(email, password);
      const user = userCredential.user;

      // 2. Obtener token de Firebase para autorización backend
      const token = await user.getIdToken();

      console.log(user);

      // 3. Llamar backend para crear/actualizar usuario en MySQL
      await fetch("http://localhost:8080/user", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          nombre: user.displayName || "",
          foto: user.photoURL || ""
        }),
      });

      // 4. Navegar a la lista principal
      navigate("/");
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
