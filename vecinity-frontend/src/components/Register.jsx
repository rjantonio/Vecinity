import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/RegisterScreen.css';
import { useAuth } from "../context/AuthContext";

function Register({ onBack }) {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const [form, setForm] = useState({
    nombre: "",
    foto: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // Función para validar contraseña
  const validarContrasena = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("La contraseña debe tener al menos una letra mayúscula");
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  };

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "foto" && files && files[0]) {
      // Convertir imagen a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => ({
          ...f,
          foto: reader.result // base64
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm(f => ({
        ...f,
        [name]: value
      }));
      
      // Validar contraseña en tiempo real
      if (name === 'password') {
        const validation = validarContrasena(value);
        if (!validation.isValid) {
          setErrors(prev => ({
            ...prev,
            password: validation.errors.join(', ')
          }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.password;
            return newErrors;
          });
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!form.nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!form.email) newErrors.email = "El correo es obligatorio";
    if (!form.password) newErrors.password = "La contraseña es obligatoria";
    
    // Validar contraseña antes de enviar
    if (form.password) {
      const passwordValidation = validarContrasena(form.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors.join(', ');
      }
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        const userCredential = await register(form.email, form.password, form.nombre, form.foto);
        if (userCredential?.user) {
          const token = await userCredential.user.getIdToken();
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
          // Login automático
          await login(form.email, form.password);
          setMessage("¡Registro exitoso! Redirigiendo a inicio...");
          setTimeout(() => navigate("/"), 1500);
        }
      } catch (error) {
        setMessage("Error: " + error.message);
      }
    }
  };

  return (
    <div className="main__content__register">
      <h2 className="register__tittle">Registro</h2>
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
        
        {/* Mostrar requisitos de contraseña */}
        <div style={{ fontSize: "0.8em", color: "#666", marginTop: "5px", marginBottom: "10px" }}>
          Requisitos de contraseña:
          <div>• Mínimo 8 caracteres</div>
          <div>• Al menos una letra mayúscula</div>
        </div>
        
        <button className="btn__submit" type="submit">
          Registrarse
        </button>
        <button className="btn__return" type="button" onClick={() => navigate("/login")}>
          Volver
        </button>
        {message && (
          <div style={{ marginTop: "1rem", color: message.startsWith("¡") ? "green" : "red" }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default Register;