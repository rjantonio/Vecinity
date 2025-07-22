import React, { useState } from 'react';

function Evento({
  name = "",
  images = [],
  description = "",
  fechaEvento = "",
  ubicacion = "",
  showJoinButton = true,
  showEditButton = false,
  onClick,
  onJoin,
  onLeave,
  onEdit,
  isJoined = false,
  isJoining = false,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- NUEVO: Formatear fecha y hora ---
  let fecha = "";
  let hora = "";
  if (fechaEvento) {
    const dateObj = new Date(fechaEvento);
    fecha = dateObj.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    hora = dateObj.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  return (
    <li
      className="event__list__item"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Banner de imagen */}
      {images && images.length > 0 && (
        <div className="event__image__banner">
          <img
            className="event__banner__image"
            src={images[currentImageIndex]}
            alt={`Imagen ${currentImageIndex + 1} del evento ${name}`}
            onError={(e) => {
              e.target.style.display = 'none';
              /* console.log('Error cargando imagen:', images[currentImageIndex]); */
            }}
          />
          
          {/* Controles de navegación si hay más de una imagen */}
          {images.length > 1 && (
            <>
              <button
                className="event__carousel__btn event__carousel__btn--prev"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                aria-label="Imagen anterior"
              >
                &#8249;
              </button>
              <button
                className="event__carousel__btn event__carousel__btn--next"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label="Siguiente imagen"
              >
                &#8250;
              </button>
              
              {/* Indicadores de imagen */}
              <div className="event__image__indicators">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`event__indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Información del evento */}
      <div className="event__info">
        <h3 className="event__title">{name}</h3>
        <h4 className="event__location">{ubicacion}</h4>
        <p className="event__description">{description}</p>
        <div className="event__datetime">
          <span className="event__date">
            <span className="event__date-icon" aria-hidden="true">📅</span> {fecha}
          </span>
          <span className="event__time">
            <span className="event__time-icon" aria-hidden="true">⏰</span> {hora}
          </span>
        </div>
        
        {showEditButton && (
            <button
                className="event__edit__btn"
                onClick={(e) => {
                e.stopPropagation(); // Para que no se dispare el onClick del li
                onEdit();            // Lógica de navegación hacia /editar-evento/:id
                }}
            >
                ✏️ Editar Evento
            </button>
        )}

        {showJoinButton && (
            isJoined ? (
                <button
                className="event__leave__btn"
                onClick={(e) => {
                    e.stopPropagation(); // ⛔ no navegues al evento
                    onLeave();
                }}
                disabled={isJoining}
                >
                {isJoining ? "Saliendo..." : "🚪 Salir"}
                </button>
            ) : (
                <button
                className="event__join__btn"
                onClick={(e) => {
                    e.stopPropagation(); // ⛔ no navegues al evento
                    onJoin();
                }}
                disabled={isJoining}
                >
                {isJoining ? "Uniendo..." : "Unirse"}
                </button>
            )
        )}
      </div>
    </li>
  );
}

export default Evento;
