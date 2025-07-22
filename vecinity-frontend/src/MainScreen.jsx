import './css/MainScreen.css';
import './css/Settings.css';
import './css/UserProfile.css';
import './css/scroll-indicator.css';
import logo from './images/logo.svg';
import videoFondo from './images/limpieza-comunitaria.mp4';
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
import { useLocation } from 'react-router-dom';

// ✅ FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle,
  faSignInAlt,
  faSignOutAlt,
  faCogs,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

function MainScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [token, setToken] = useState(null);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Verificar si estamos en la página principal
  const isHomePage = location.pathname === '/';
  
  // Función de logout personalizada que redirige al home
  const handleLogout = async () => {
    await logout();
    navigate('/'); // Redirigir al home después del logout
  };
  
  // Manejador para cuando el video ha cargado
  const handleVideoLoad = () => {
    /* console.log("Video cargado correctamente"); */
    setVideoLoaded(true);
  };

  // Obtener token del usuario autenticado
  useEffect(() => {
    if (user) {
      user.getIdToken()
        .then(setToken)
        .catch(error => {
          /* console.error("Error al obtener token:", error); */
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
    <div className={`main__screen ${isHomePage ? 'homepage' : ''}`}>
      {/* Video de fondo solo en homepage */}
      {isHomePage && (
        <div className="video-background-full">
          <video
            className="video-hero-full"
            autoPlay
            loop
            muted
            onLoadedData={handleVideoLoad}
          >
            <source src={videoFondo} type="video/mp4" />
            Tu navegador no soporta videos HTML5.
          </video>
          
          {/* Contenido sobre el video */}
          <div className="hero-content">
            <h1 className="hero-title">
              <img src={logo} alt="Vecinity Logo" />
            </h1>
            <p className="hero-description">Conecta con tu comunidad y participa en eventos locales</p>
            <button className="home__cta__button" onClick={() => navigate("/eventos")}>
              Explorar Eventos
            </button>
          </div>
          
          {/* Indicador de scroll */}
          <div className="scroll-indicator" onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}>
            <div className="scroll-arrow">
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
          </div>
        </div>
      )}
      
      {/* Barra de navegación sticky */}
      <div className="main-header">
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
                onClick={handleLogout} // Usar la función personalizada
                title="Cerrar sesión"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Contenido principal con rutas */}
      <div className="main__content">
        <Routes>
          <Route path="/" element={<HomePage user={user} token={token} />} />
          <Route path="/eventos" element={<EventList user={user} token={token} />} />
          <Route path="/event/:id" element={<EventDetail token={token} user={user} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crear-evento" element={<CrearEvento token={token} />} />
          <Route path="/editar-evento" element={<Editarevento  />} />
          <Route path="/editar-evento/:id" element={<Editarevento token={token} />} />
          <Route path="*" element={<ErrorScreen />} />
        </Routes>
      </div>
    </div>
  );
}

export default MainScreen;
