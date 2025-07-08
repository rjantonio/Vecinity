import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/RegisterScreen.css';

function Register({ onBack }) {
  const navigate = useNavigate();
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
      if (onBack) onBack();
    }
  };

  return (
    <div className="main__content__register">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} className="form__register">
        <input
          className="input"
          type="text"
          name="nombre"
          placeholder="Nombre*"
          value={form.nombre}
          onChange={handleChange}
        />
        {errors.nombre && <span style={{ color: "red", fontSize: "0.9em" }}>{errors.nombre}</span>}
        <input
          className="input"
          type="file"
          name="foto"
          accept="image/*"
          onChange={handleChange}
        />
        <input
          className="input"
          type="email"
          name="email"
          placeholder="Correo electrónico*"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <span style={{ color: "red", fontSize: "0.9em" }}>{errors.email}</span>}
        <input
          className="input"
          type="password"
          name="password"
          placeholder="Contraseña*"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <span style={{ color: "red", fontSize: "0.9em" }}>{errors.password}</span>}
        <button className="btn__submit" type="submit">
          Registrarse
        </button>
        <button className="btn__return" type="button" onClick={() => navigate("/login")}>
          Volver
        </button>
      </form>
    </div>
  );
}

export default Register;