import './css/MainScreen.css';
import './css/Settings.css';
import './css/UserProfile.css';
import logo from './images/logo.png';
import login__img from './images/icono-login.png';
import ajustes__img from './images/icono-ajustes.png';
import profile__img from './images/icono-profile.png'; // Asegúrate de tener este icono
import logout__img from './images/icono-logout.png';   // Asegúrate de tener este icono
import { Routes, Route, useNavigate } from "react-router-dom";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import ErrorScreen from "./components/ErrorScreen";
import Login from "./components/Login";
import Register from "./components/Register";
import { useAuth } from "./context/AuthContext";

function MainScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
            <img className="settings__icon" src={ajustes__img} alt="" />
          </button>
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
          <Route path="/" element={
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
          } />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="*" element={<ErrorScreen/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default MainScreen;