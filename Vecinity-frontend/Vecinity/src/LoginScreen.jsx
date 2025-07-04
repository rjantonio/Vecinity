import React, { useState } from "react";
import MainScreen from "./MainScreen";

function RegisterForm({ onBack }) {
  const [form, setForm] = useState({
    nombre: "",
    foto: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === "foto" ? files[0] : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newErrors = {};
    if (!form.nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!form.email) newErrors.email = "El correo es obligatorio";
    if (!form.password) newErrors.password = "La contraseña es obligatoria";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert("¡Registro exitoso!");
      onBack();
    }
  };

  return (
    <div style={{
      background: "#fff",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      width: "320px",
      textAlign: "center"
    }}>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre*"
          value={form.nombre}
          onChange={handleChange}
          style={{ padding: "0.75rem", borderRadius: "4px", border: "1px solid #ccc" }}/>
        {errors.nombre && <span style={{ color: "red", fontSize: "0.9em" }}>{errors.nombre}</span>}
        <input
          type="file"
          name="foto"
          accept="image/*"
          onChange={handleChange}
          style={{ padding: "0.75rem", borderRadius: "4px", border: "1px solid #ccc" }}/>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico*"
          value={form.email}
          onChange={handleChange}
          style={{ padding: "0.75rem", borderRadius: "4px", border: "1px solid #ccc" }}/>
        {errors.email && <span style={{ color: "red", fontSize: "0.9em" }}>{errors.email}</span>}
        <input
          type="password"
          name="password"
          placeholder="Contraseña*"
          value={form.password}
          onChange={handleChange}
          style={{ padding: "0.75rem", borderRadius: "4px", border: "1px solid #ccc" }}/>
        {errors.password && <span style={{ color: "red", fontSize: "0.9em" }}>{errors.password}</span>}
        <button
          type="submit"
          style={{
            padding: "0.75rem",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
          Registrarse
        </button>
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: "0.75rem",
            background: "#e0e0e0",
            color: "#1976d2",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
          Volver
        </button>
      </form>
    </div>
  );
}
function LoginScreen() {
  const [showRegister, setShowRegister] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn) {
    return <MainScreen onLogout={() => setLoggedIn(false)} />;
  }

  if (showRegister) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5"
      }}>
        <RegisterForm onBack={() => setShowRegister(false)} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f5f5"
    }}>
      <div style={{
        background: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        width: "320px",
        textAlign: "center"
      }}>
        <input
          type="email"
          placeholder="Correo electrónico"
          style={{
            width: "90%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}/>
        <input
          type="password"
          placeholder="Contraseña"
          style={{
            width: "90%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}/>
        <button
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            marginBottom: "1rem",
            cursor: "pointer"
          }}
          onClick={() => setLoggedIn(true)}
        >
          Iniciar sesión
        </button>
        <button
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#e0e0e0",
            color: "#1976d2",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
          onClick={() => setShowRegister(true)}
        >
          Registrarte
        </button>
      </div>
    </div>
  );
}

export default LoginScreen;