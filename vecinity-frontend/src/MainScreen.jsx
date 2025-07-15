import './css/MainScreen.css';
import './css/Settings.css';
import './css/UserProfile.css';
import logo from './images/logo.svg';
import login__img from './images/icono-login.png';
import ajustes__img from './images/icono-ajustes.png';
import profile__img from './images/icono-profile.png';
import logout__img from './images/icono-logout.png';
import { Routes, Route, useNavigate } from "react-router-dom";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import ErrorScreen from "./components/ErrorScreen";
import Login from "./components/Login";
import Register from "./components/Register";
import CrearEvento from './components/CrearEvento';
import Editarevento from './components/EditarEvento';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import SettingsDropdown from "./components/SettingsDropdown";
import HomePage from "./components/HomePage";
import { useAuth } from "./context/AuthContext";
import React, { useEffect, useState } from 'react';

function MainScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [token, setToken] = useState(null);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false); // ✅ Necesario para el dropdown

  // Obtener token del usuario autenticado
  useEffect(() => {
    if (user) {
      user.getIdToken()
        .then(setToken)
        .catch(error => {
          console.error("Error al obtener token:", error);
        });
    } else {
      setToken(null);
    }
  }, [user]);

  // Modo oscuro y daltonismo
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedColorBlindMode = localStorage.getItem('colorBlindMode') === 'true';

    if (savedDarkMode) document.body.classList.add('dark-mode');
    if (savedColorBlindMode) document.body.classList.add('colorblind-mode');
  }, []);

  return (
    <div className="main__screen">
      {/* Barra de navegación */}
      <div className="barrnav">
        <button
          onClick={() => navigate("/")}
          className="logo"
          title="Ir al inicio"
        >
          <img className="logo__img" src={logo} alt="Logo" />
        </button>
        <div className="barrnav__rigth">
          <div 
            className="settings__container"
            onMouseEnter={() => setShowSettingsDropdown(true)}
            onMouseLeave={() => setShowSettingsDropdown(false)}
          >
            <button 
              className="btn__settings"
              title="Preferencias"
            >
              <img className="settings__icon" src={ajustes__img} alt="Ajustes" />
            </button>
            <SettingsDropdown isVisible={showSettingsDropdown} />
          </div>
          {!user ? (
            <button className="btn__login" onClick={() => navigate("/login")} title="Iniciar sesión">
              <img className="login__icon" src={login__img} alt="Iniciar sesión" />
            </button>
          ) : (
            <>
              <button className="btn__login" onClick={() => navigate("/profile")} title="Perfil">
                <img className="login__icon" src={profile__img} alt="Perfil" />
              </button>
              <button className="btn__logout" onClick={logout} title="Cerrar sesión">
                <img className="login__icon" src={logout__img} alt="Cerrar sesión" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Contenido principal con rutas */}
      <div className="main__content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/eventos" element={<EventList user={user} token={token} />} />
          <Route path="/event/:id" element={<EventDetail token={token} user={user} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crear-evento" element={<CrearEvento token={token} />} />
          <Route path="/editar-evento" element={<Editarevento />} />
          <Route path="/editar-evento/:id" element={<Editarevento token={token} />} />
          <Route path="*" element={<ErrorScreen />} />
        </Routes>
      </div>
    </div>
  );
}

export default MainScreen;
