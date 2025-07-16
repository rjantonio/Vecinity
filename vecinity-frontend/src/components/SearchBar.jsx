import React, { useState, useEffect } from 'react';
import '../css/SearchBar.css';

// Componente SearchBar
const SearchBar = ({ onSearch, placeholder = "Buscar eventos..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Ejecutar búsqueda en tiempo real con debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // 300 ms después de que dejás de escribir

    return () => clearTimeout(delayDebounce); // Limpia el timeout si seguís escribiendo
  }, [searchTerm, onSearch]);

  // Actualizar término de búsqueda
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Opcional: dejar el submit para que también funcione al presionar Enter
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          aria-label="Buscar"
        />
        <button type="submit" className="search-button">
          Buscar
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
