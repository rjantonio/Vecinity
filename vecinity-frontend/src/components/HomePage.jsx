import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';

function HomePage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/event", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener eventos");
        return res.json();
      })
      .then(async data => {
        // Obtener solo los primeros 3 eventos
        const eventosLimitados = data.slice(0, 3);
        
        // Obtener imágenes para cada evento igual que en EventList
        const eventosConImagenes = await Promise.all(
          eventosLimitados.map(async evento => {
            try {
              const imgRes = await fetch(`http://localhost:8080/event-images/${evento.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              });
              if (imgRes.ok) {
                const imagenes = await imgRes.json();
                return {
                  ...evento,
                  imagenes: imagenes.map(img => `data:image/jpeg;base64,${img.imagenBase64}`)
                };
              }
              return evento;
            } catch (err) {
              console.error(`Error al obtener imágenes para evento ${evento.id}:`, err);
              return evento;
            }
          })
        );
        
        setEventos(eventosConImagenes);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <p>Sobre nosotros</p>
      
      <div className="eventos-ejemplo">
        <h3 className="eventos-ejemplo-titulo">Eventos Destacados</h3>
        
        {loading && <p className="loading-text">Cargando eventos...</p>}
        {error && <p className="error-text">Error: {error}</p>}
        
        {!loading && !error && eventos.length > 0 && (
          <div className="eventos-grid">
            {eventos.map(evento => (
              <div 
                key={evento.id} 
                className="evento-card"
                onClick={() => navigate(`/event/${evento.id}`)}
              >
                {evento.imagenes && evento.imagenes.length > 0 ? (
                  <img 
                    src={evento.imagenes[0]} 
                    alt={evento.titulo}
                    className="evento-imagen"
                  />
                ) : (
                  <div className="evento-sin-imagen">
                    <span>📷</span>
                    <p>Sin imagen</p>
                  </div>
                )}
                <div className="evento-info">
                  <h4 className="evento-titulo">{evento.titulo}</h4>
                  <p className="evento-ubicacion">📍 {evento.ubicacion}</p>
                  <p className="evento-fecha">📅 {new Date(evento.fechaEvento).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && !error && eventos.length === 0 && (
          <p className="no-eventos">No hay eventos disponibles</p>
        )}
      </div>
    </>
  );
}

export default HomePage;