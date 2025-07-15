import { useState, useEffect } from "react";
import "../css/SettingsDropdown.css";

function SettingsDropdown({ isVisible }) {
    const [darkMode, setDarkMode] = useState(false);
    const [colorBlindMode, setColorBlindMode] = useState(false);

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        const savedColorBlindMode = localStorage.getItem('colorBlindMode') === 'true';

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

    return (
        <div className={`settings__dropdown ${isVisible ? 'visible' : ''}`}>
            <h3 className="dropdown__title">Preferencias</h3>
            <div className="dropdown__content">
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
        </div>
    );
}

export default SettingsDropdown;