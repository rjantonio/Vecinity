import React, { useState } from "react";
import '../css/MainScreen.css';
import logo from '../images/logo.png';
import login__img from '../images/icono-login.png';
import ajustes__img from '../images/icono-ajustes.png'


function MainScreen() {
  const [view, setView] = useState("list");

  const items = [
    {
      id: 1,
      nombre: "Ejemplo de objeto",
      descripcion: "Este es un objeto de prueba con una imagen y una descripción.",
      imagen: "https://google.com"
    }
  ];

  return (
    <div className="main__content">
      <div className="barrnav">
        <button
          onClick={() => setView("list")}
          className="logo"
          title="Ir a la lista"
        >
          <img className="logo__img" src={logo} alt="" />
        </button>
        <div className="barrnav__rigth">
          <button className="btn__settings"
            onClick={() => setView("preferences")}
            title="Preferencias"
          >
            <img className="settings__icon" src={ajustes__img} alt="" />
          </button>
          <button className="btn__login"
            onClick={() => setView("profile")}
            title="Perfil"
          >
            <img className="login__icon" src={login__img} alt="" />
          </button>
        </div>
      </div>

      <div className="content__event">
        {view === "list" && (
          <>
            <h2>Lista de objetos</h2>
            <ul className="event__list">
              {items.map(item => (
                <li className="event__list__item" key={item.id}>
                  <img className="event__list__img" src={item.imagen} alt={item.nombre}/>
                  <div>
                    <h3 style={{ margin: 0 }}>{item.nombre}</h3>
                    <p style={{ margin: 0 }}>{item.descripcion}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {view === "profile" && (
            <UserProfile onBack={() => setView("list")} />
        )}
        {view === "preferences" && (
          <>
            <h2>Preferencias</h2>
            <p>Aquí irán las opciones de preferencias.</p>
            <button
              style={{
                marginTop: "1rem",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "0.5rem 1rem",
                cursor: "pointer"
              }}
              onClick={() => setView("list")}
            >
              Volver a la lista
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function UserProfile({ onBack }) {
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState({
    nombre: "Nombre de Usuario",
    email: "usuario@correo.com",
    foto: "https://via.placeholder.com/120"
  });
  const [temp, setTemp] = useState(user);

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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <label style={{ cursor: edit ? "pointer" : "default" }}>
        <img
          src={edit ? temp.foto : user.foto}
          alt="Foto de perfil"
          style={{ width: 120, height: 120, borderRadius: "50%", marginBottom: 16, objectFit: "cover" }}
        />
        {edit && (
          <input
            type="file"
            name="foto"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
          />
        )}
      </label>
      {edit ? (
        <input
          type="text"
          name="nombre"
          value={temp.nombre}
          onChange={handleChange}
          style={{
            marginBottom: 8,
            fontSize: "1.2rem",
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid #ccc",
            padding: "0.5rem"
          }}
        />
      ) : (
        <h3 style={{ margin: 0 }}>{user.nombre}</h3>
      )}
      {edit ? (
        <input
          type="email"
          name="email"
          value={temp.email}
          onChange={handleChange}
          style={{
            marginBottom: 16,
            fontSize: "1rem",
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid #ccc",
            padding: "0.5rem"
          }}
        />
      ) : (
        <p style={{ margin: 0, marginBottom: 16 }}>{user.email}</p>
      )}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          style={{
            background: "#e57373",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "0.5rem 1rem",
            cursor: "pointer"
          }}
          // Por ahora no hace nada
        >
          Desactivar cuenta
        </button>
        <button
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "0.5rem 1rem",
            cursor: "pointer"
          }}
          onClick={edit ? handleSave : () => { setTemp(user); setEdit(true); }}
        >
          {edit ? "Guardar" : "Editar"}
        </button>
        <button
          style={{
            background: "#e0e0e0",
            color: "#1976d2",
            border: "none",
            borderRadius: "4px",
            padding: "0.5rem 1rem",
            cursor: "pointer"
          }}
          onClick={onBack}
        >
          Volver a la lista
        </button>
      </div>
    </div>
  );
}

export default MainScreen;