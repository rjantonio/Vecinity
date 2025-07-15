import './css/MainScreen.css';
import './css/Settings.css';
import './css/UserProfile.css';
import logo from './images/logo.png';
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
import { useAuth } from "./context/AuthContext";
import { auth } from "./utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import HomePage from "./components/HomePage";
import React, { useEffect, useState } from 'react';
import CrearEvento from './components/CrearEvento';
import Editarevento from './components/EditarEvento';
import Evento from './components/Evento';
import SettingsDropdown from "./components/SettingsDropdown";

function EventRegistrationsList({ token }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return; // No hacer la petición sin token

    fetch('http://localhost:8080/event-registration', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setRegistrations(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (!token) return <div>Esperando autenticación...</div>;
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Inscripciones a eventos</h2>
      <ul>
        {registrations.map(reg => (
          <li key={reg.id}>
            Usuario ID: {reg.userId}, Evento ID: {reg.eventId}, Fecha: {reg.fechaInscripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MainScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedColorBlindMode = localStorage.getItem('colorBlindMode') === 'true';
    
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
    if (savedColorBlindMode) {
      document.body.classList.add('colorblind-mode');
    }
  }, []);

  // Obtener token cuando el usuario esté autenticado
  useEffect(() => {
    if (user) {
      user.getIdToken().then(userToken => {
        setToken(userToken);
      });
    } else {
      setToken(null);
    }
  }, [user]);

  // Fetch de eventos con autenticación
  useEffect(() => {
    if (!token) return; // No hacer la petición sin token

    fetch('http://localhost:8080/event', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los eventos');
        }
        return response.json();
      })
      .then(data => {
        console.log('Eventos obtenidos:', data);
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtener eventos:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="main__screen">
      <div className="barrnav">
        <button
          onClick={() => navigate("/")}
          className="logo"
          title="Ir al inicio"
        >
          <img className="logo__img" src={logo} alt="" />
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
              <img className="settings__icon" src={ajustes__img} alt="" />
            </button>
            <SettingsDropdown isVisible={showSettingsDropdown} />
          </div>
          {!user ? (
            <button
              className="btn__login"
              onClick={() => navigate("/login")}
              title="Iniciar sesión"
            >
              <img className="login__icon" src={login__img} alt="Iniciar sesión" />
            </button>
          ) : (
            <>
              <button
                className="btn__login"
                onClick={() => navigate("/profile")}
                title="Perfil"
              >
                <img className="login__icon" src={profile__img} alt="Perfil" />
              </button>
              <button
                className="btn__logout"
                onClick={logout}
                title="Cerrar sesión"
              >
                <img className="login__icon" src={logout__img} alt="Cerrar sesión" />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="main__content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/eventos" element={
            <>
              <h2>Lista de eventos</h2>
              {!token ? (
                <div>Autenticando...</div>
              ) : loading ? (
                <div>Cargando eventos...</div>
              ) : error ? (
                <div>Error: {error}</div>
              ) : (
                <ul className="event__list">
                  {items.map(item => (
                    <Evento
                      key={item.id}
                      name={item.titulo}
                      fechaEvento={item.fechaEvento}
                      images={[item.imagen]}
                      description={item.descripcion}
                      ubicacion={item.ubicacion}
                    />
                  ))}
                </ul>
              )}
              <button onClick={()=>navigate("/crear-evento")}>Crear Evento</button>
              <button onClick={()=>navigate("/editar-evento")}>Editar Evento</button>
              <EventRegistrationsList token={token} />
            </>
          } />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/crear-evento" element={<CrearEvento token={token}/>}/>
          <Route path="/editar-evento" element={<Editarevento token={token}/>}/>
          <Route path="*" element={<ErrorScreen/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default MainScreen;