import './css/MainScreen.css';
import './css/Settings.css';
import './css/UserProfile.css';
import logo from './images/logo.png';
import { Routes, Route, useNavigate } from "react-router-dom";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import ErrorScreen from "./components/ErrorScreen";
import Login from "./components/Login";
import Register from "./components/Register";
import { useAuth } from "./context/AuthContext";
import { auth } from "./utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
// Importación del componente SearchBar para la funcionalidad de búsqueda
import SearchBar from "./components/SearchBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle, 
  faSignInAlt, 
  faSignOutAlt, 
  faCogs,
  faCalendarPlus, 
  faEdit,
  faHandshake 
} from '@fortawesome/free-solid-svg-icons';

import React, { useEffect, useState } from 'react';
import CrearEvento from './components/CrearEvento';
import Editarevento from './components/EditarEvento';
import Evento from './components/Evento';

function EventRegistrationsList({ token }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

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
    <div className="enrolled__events__list">
      <h2>Inscripciones a eventos</h2>
      <ul>
        {registrations.map(reg => (
          <li key={reg.id} className="enrolled__event__item">
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
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Autenticación para obtener el token
  useEffect(() => {
    signInWithEmailAndPassword(auth, "franpoloflan@gmail.com", "123456")
      .then(userCredential => {
        console.log(userCredential);
        return userCredential.user.getIdToken();
      })
      .then(token => {
        console.log("Token:", token);
        setToken(token);
      })
      .catch(error => {
        console.error("Error signing in:", error);
        setError("Error de autenticación");
        setLoading(false);
      });
  }, []);

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
        setFilteredItems(data); // Inicialmente, los elementos filtrados son los mismos que todos los elementos
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtener eventos:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  // FUNCIONALIDAD DE BÚSQUEDA - INICIO
  // Función para manejar la búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term); // Guarda el término de búsqueda actual
    
    if (!term.trim()) {
      // Si el término de búsqueda está vacío, mostrar todos los elementos
      setFilteredItems(items);
      return;
    }
    
    // Filtrar los elementos que coincidan con el término de búsqueda (solo por título)
    const filtered = items.filter(item => 
      item.titulo && item.titulo.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredItems(filtered); // Actualiza la lista filtrada que se muestra
  };
  // FUNCIONALIDAD DE BÚSQUEDA - FIN

  return (
    <div className="main__screen">
      <div className="barrnav">
        <button
          onClick={() => navigate("/")}
          className="logo"
          title="Ir a la lista"
        >
          <img className="logo__img" src={logo} alt="" />
        </button>
        <div className="barrnav__rigth">
          <button className="btn__settings"
            onClick={() => navigate("/settings")}
            title="Preferencias"
          >
            <FontAwesomeIcon className="nav-icon" icon={faCogs} />
          </button>
          {!user ? (
            <button
              className="btn__login"
              onClick={() => navigate("/login")}
              title="Iniciar sesión"
            >
              <FontAwesomeIcon className="nav-icon" icon={faSignInAlt} />
            </button>
          ) : (
            <>
              <button
                className="btn__login"
                onClick={() => navigate("/profile")}
                title="Perfil"
              >
                <FontAwesomeIcon className="nav-icon" icon={faUserCircle} />
              </button>
              <button
                className="btn__logout"
                onClick={logout}
                title="Cerrar sesión"
              >
                <FontAwesomeIcon className="nav-icon" icon={faSignOutAlt} />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Barra de búsqueda en la zona superior de la página */}
      <div className="search-area">
        <SearchBar onSearch={handleSearch} placeholder="Buscar eventos por título..." />
      </div>
      <div className="main__content">
        <Routes>
          <Route path="/" element={
            <>
              <h2>Lista de eventos</h2>
              
              {/* BOTONES DE ACCIÓN */}
              <div className="event-buttons-container">
                <button 
                  className="event-button create-event" 
                  onClick={() => navigate("/crear-evento")}
                >
                  <span className="event-button-icon">+</span>
                  <span className="event-button-text">Crear Evento</span>
                </button>
                <button 
                  className="event-button edit-event" 
                  onClick={() => navigate("/editar-evento")}
                >
                  <span className="event-button-icon">✎</span>
                  <span className="event-button-text">Editar Evento</span>
                </button>
              </div>
              
              {!token ? (
                <div>Autenticando...</div>
              ) : loading ? (
                <div>Cargando eventos...</div>
              ) : error ? (
                <div>Error: {error}</div>
              ) : (
                <>
                  {/* RESULTADOS DE BÚSQUEDA - INICIO */}
                  {/* Muestra el número de resultados cuando hay un término de búsqueda */}
                  {searchTerm && (
                    <p className="search-results">Resultados para "{searchTerm}": {filteredItems.length} eventos</p>
                  )}
                  
                  {/* Lista de eventos filtrada por la búsqueda */}
                  <ul className="event__list">
                    {filteredItems.map(item => (
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
                  
                  {/* Mensaje cuando no hay resultados para la búsqueda */}
                  {searchTerm && filteredItems.length === 0 && (
                    <p className="no-results">No se encontraron eventos que coincidan con tu búsqueda</p>
                  )}
                  {/* RESULTADOS DE BÚSQUEDA - FIN */}
                  
                  {/* Nota: Estas líneas eran parte de un conflicto git. Los botones se movieron arriba junto con la barra de búsqueda 
                  para una mejor experiencia de usuario
                  <button className="create__event__btn" onClick={()=>navigate("/crear-evento")}>Crear Evento</button>
                  <button className="edit__event__btn" onClick={()=>navigate("/editar-evento")}>Editar Evento</button>
                  */}
                  
                  <EventRegistrationsList token={token} />
                </>
              )}
            </>
          } />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/crear-evento" element={<CrearEvento/>}/>
          <Route path="/editar-evento" element={<Editarevento/>}/>
          <Route path="*" element={<ErrorScreen/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default MainScreen;
