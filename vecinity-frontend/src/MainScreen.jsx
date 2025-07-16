import './css/MainScreen.css';
import './css/Settings.css';
import './css/UserProfile.css';
import logo from './images/logo.svg';
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

// ✅ FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle,
  faSignInAlt,
  faSignOutAlt,
  faCogs
} from '@fortawesome/free-solid-svg-icons';

function MainScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [token, setToken] = useState(null);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

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
          {/* Ajustes con dropdown */}
          <div
            className="settings__container"
            onMouseEnter={() => setShowSettingsDropdown(true)}
            onMouseLeave={() => setShowSettingsDropdown(false)}
          >
            <button
              className="btn__settings"
              title="Preferencias"
            >
              <FontAwesomeIcon icon={faCogs} className="nav-icon" />
            </button>
            <SettingsDropdown isVisible={showSettingsDropdown} />
          </div>

          {!user ? (
            <button
              className="btn__login"
              onClick={() => navigate("/login")}
              title="Iniciar sesión"
            >
              <FontAwesomeIcon icon={faSignInAlt} className="nav-icon" />
            </button>
          ) : (
            <>
              <button
                className="btn__login"
                onClick={() => navigate("/profile")}
                title="Perfil"
              >
                <FontAwesomeIcon icon={faUserCircle} className="nav-icon" />
              </button>
              <button
                className="btn__logout"
                onClick={logout}
                title="Cerrar sesión"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Contenido principal con rutas */}
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
  );
}

export default MainScreen;
