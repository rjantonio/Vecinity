import React, { useState } from "react";
import "../css/UserProfile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState({
    nombre: "Nombre de Usuario",
    email: "usuario@correo.com",
    foto: "https://via.placeholder.com/120"
  });
  const [temp, setTemp] = useState(user);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, files } = e.target;
    setTemp(t => ({
      ...t,
      [name]: name === "foto" && files[0]
        ? URL.createObjectURL(files[0])
        : value
    }));
  };

  const handleSave = () => {
    setUser(temp);
    setEdit(false);
  };

  return (
    <div className="container__user">
      <label style={{ cursor: edit ? "pointer" : "default" }}>
        <img className="user__img"
          src={edit ? temp.foto : user.foto}
          alt="Foto de perfil"
        />
        {edit && (
          <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
          />
        )}
      </label>
      {edit ? (
        <input
          className="input__name"
          type="text"
          name="nombre"
          value={temp.nombre}
          onChange={handleChange}
        />
      ) : (
        <h3>{user.nombre}</h3>
      )}
      {edit ? (
        <input
          className="input__email"
          type="email"
          name="email"
          value={temp.email}
          onChange={handleChange}
        />
      ) : (
        <p>{user.email}</p>
      )}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          className="btn__disable__acc"
        >
          Desactivar cuenta
        </button>
        <button
          className="btn__save__acc"
          onClick={edit ? handleSave : () => { setTemp(user); setEdit(true); }}
        >
          {edit ? "Guardar" : "Editar"}
        </button>
        <button
          className="btn__return__list"
          onClick={() => navigate("/")}
        >
          Volver a la lista
        </button>
      </div>
    </div>
  );
}

export default Profile;