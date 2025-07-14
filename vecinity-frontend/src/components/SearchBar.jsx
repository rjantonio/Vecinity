/*===========================================
  COMPONENTE DE BARRA DE BÚSQUEDA
  
  Proporciona una interfaz para que los usuarios
  busquen eventos por título. Incluye un campo
  de entrada de texto y un botón de búsqueda.
=============================================*/

import React, { useState } from 'react';
import '../css/SearchBar.css'; // Importación de estilos específicos

// Componente SearchBar que recibe:
// - onSearch: función que maneja la búsqueda en el componente padre
// - placeholder: texto de ayuda para el campo de búsqueda (opcional)
const SearchBar = ({ onSearch, placeholder = "Buscar eventos..." }) => {
  // Estado local para almacenar el término de búsqueda actual
  const [searchTerm, setSearchTerm] = useState('');

  // Función para manejar el envío del formulario de búsqueda
  const handleSearch = (e) => {
    e.preventDefault(); // Previene la recarga de la página
    onSearch(searchTerm); // Envía el término de búsqueda al componente padre
  };

  // Función para manejar cambios en el campo de entrada
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Actualiza el estado local
    
    // Reset automático de la búsqueda cuando el campo está vacío
    if (value === '') {
      onSearch(''); // Limpia los resultados de búsqueda
    }
  };

  return (
    /* Contenedor principal de la barra de búsqueda */
    <div className="search-bar">
      {/* Formulario que maneja el evento de búsqueda */}
      <form onSubmit={handleSearch}>
        {/* Campo de entrada para el término de búsqueda */}
        <input
          type="text"
          className="search-input"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          aria-label="Buscar" // Etiqueta para accesibilidad
        />
        {/* Botón para ejecutar la búsqueda */}
        <button 
          type="submit" 
          className="search-button"
        >
          Buscar
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
