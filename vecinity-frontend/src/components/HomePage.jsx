import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';

function HomePage({ user, token }) {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

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
        const eventosConImagenes = await Promise.all(
          data.map(async evento => {
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
        setEventos(eventosConImagenes.slice(0, 3));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <>
        <h2 className="about-title">Sobre nosotros</h2>
        <div className="about-content">
          <p className="about-text">
            Somos un equipo de 4 estudiantes apasionados del bootcamp de Java de 
            <strong> Fundación Esplai</strong>, comprometidos con la innovación tecnológica 
            y el impacto social positivo.
          </p>
          <p className="about-text">
            Como proyecto final de nuestro bootcamp, hemos desarrollado <strong>Vecinity</strong>, 
            una aplicación que busca contribuir a varios <strong>Objetivos de Desarrollo Sostenible </strong> 
            de la ONU, especialmente:
          </p>
          <div className="ods-list">
            <div className="ods-item">
              <span className="ods-number">11</span>
              <span className="ods-text">Ciudades y Comunidades Sostenibles</span>
            </div>
            <div className="ods-item">
              <span className="ods-number">17</span>
              <span className="ods-text">Alianzas para lograr los Objetivos</span>
            </div>
          </div>
          <p className="about-text">
            Nuestra misión es fortalecer los vínculos comunitarios y promover la participación 
            ciudadana a través de la tecnología, creando espacios digitales que fomenten 
            la colaboración y el bienestar social.
          </p>
        </div>
      
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