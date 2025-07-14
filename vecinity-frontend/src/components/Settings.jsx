import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Settings.css";

function Settings(){
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [colorBlindMode, setColorBlindMode] = useState(false);

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        const savedColorBlindMode = localStorage.getItem('colorBlindMode') === 'true';

        //Modo Oscuro
        setDarkMode(savedDarkMode);
        setColorBlindMode(savedColorBlindMode);
        
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
        }
        if (savedColorBlindMode) {
            document.body.classList.add('colorblind-mode');
        }
    }, []);

    const handleDarkModeToggle = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        
        localStorage.setItem('darkMode', newDarkMode.toString());
        
        if (newDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    // Modo daltónico
    const handleColorBlindModeToggle = () => {
        const newColorBlindMode = !colorBlindMode;
        setColorBlindMode(newColorBlindMode);
        
        localStorage.setItem('colorBlindMode', newColorBlindMode.toString());
        
        if (newColorBlindMode) {
            document.body.classList.add('colorblind-mode');
        } else {
            document.body.classList.remove('colorblind-mode');
        }
    };

    return(
        <>
          <h2>Preferencias</h2>
          <div className="settings__container">
            <div className="setting__item">
              <label htmlFor="darkModeToggle" className="setting__label">
                Modo oscuro
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
            
            <div className="setting__item">
              <label htmlFor="colorBlindModeToggle" className="setting__label">
                Modo daltónico
              </label>
              <label className="switch">
                <input
                  type="checkbox"
                  id="colorBlindModeToggle"
                  checked={colorBlindMode}
                  onChange={handleColorBlindModeToggle}
                />
                <span className="slider colorblind-slider"></span>
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