import React, { useState } from 'react';
import '../css/SearchBar.css'; // Importación de estilos específicos

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
    setSearchTerm(value);
    onSearch(value); // Ejecuta búsqueda en tiempo real
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
