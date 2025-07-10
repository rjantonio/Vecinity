import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Settings.css";

function Settings(){
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

    // Cargar el modo oscuro desde localStorage al montar el componente
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
        }
    }, []);

    // Manejar el cambio del modo oscuro
    const handleDarkModeToggle = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        
        // Guardar en localStorage
        localStorage.setItem('darkMode', newDarkMode.toString());
        
        // Aplicar/remover la clase dark-mode del body
        if (newDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    return(
        <>
          <h2>Preferencias</h2>
          <div className="settings__container">
            <div className="setting__item">
              <label htmlFor="darkModeToggle" className="setting__label">
                Modo nocturno
              </label>
              <label className="switch">
                <input
                  type="checkbox"
                  id="darkModeToggle"
                  checked={darkMode}
                  onChange={handleDarkModeToggle}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <button
            className="btn__return__list"
            onClick={() => navigate("/")}
          >
            Volver a la lista
          </button>
        </>
    );
}

export default Settings;