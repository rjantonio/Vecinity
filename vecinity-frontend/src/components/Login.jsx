import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/LoginScreen.css';
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register, login } = useAuth(); // Asegúrate de tener login aquí
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/"); // Redirige a la lista al iniciar sesión
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};
    if (!form.nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!form.email) newErrors.email = "El correo es obligatorio";
    if (!form.password) newErrors.password = "La contraseña es obligatoria";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // 1. Registrar en Firebase primero
        const userCredential = await register(form.email, form.password, form.nombre, form.foto);

        // 2. Si Firebase fue exitoso, obtener el token y registrar en Spring Boot
        if (userCredential?.user) {
          const token = await userCredential.user.getIdToken();

          // 3. Enviar datos al backend de Spring Boot
          await fetch("http://localhost:8080/user", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              nombre: form.nombre,
              email: form.email,
              foto: form.foto
            })
          });

          // 4. Hacer login automático
          await login(form.email, form.password);
          navigate("/"); // Redirige a la página principal
        }
      } catch (error) {
        setMessage("Error: " + error.message);
      }
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