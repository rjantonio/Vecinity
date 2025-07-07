import React, { useState } from "react";
import '../css/MainScreen.css';
import '../css/Settings.css';
import '../css/UserProfile.css';
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
    <div className="main__screen">
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

      <div className="main__content">
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
            className="btn__return__list"
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
          // Por ahora no hace nada
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
          onClick={onBack}
        >
          Volver a la lista
        </button>
      </div>
    </div>
  );
}

export default MainScreen;