import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/EventDetail.css';

function EventDetail({ token, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [attendeesCount, setAttendeesCount] = useState(20); // Estado para el contador de asistentes

  useEffect(() => {
    if (!token || !id) return;

    setLoading(true);
    Promise.all([
      // Obtener datos del evento
      fetch(`http://localhost:8080/event/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (!res.ok) throw new Error('No se encontró el evento');
        return res.json();
      }),
      // Obtener imágenes del evento
      fetch(`http://localhost:8080/event-images/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => (res.ok ? res.json() : [])),
      // Verificar si el usuario ya está registrado en el evento
      fetch(`http://localhost:8080/event-registration/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => (res.ok ? res.json() : { isRegistered: false }))
    ])
      .then(([eventData, imgData, registrationData]) => {
        // Procesar imágenes
        eventData.imagenes = imgData.map(img => `data:image/jpeg;base64,${img.imagenBase64}`);
        setEvento(eventData);
        setJoined(registrationData.isRegistered || false);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  // Funciones para el carrusel de imágenes
  const nextImage = () => {
    if (evento?.imagenes?.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === evento.imagenes.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (evento?.imagenes?.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? evento.imagenes.length - 1 : prev - 1
      );
    }
  };

  // Función para unirse al evento
  const handleJoin = () => {
    if (!token) {
      alert('Debes iniciar sesión para unirte al evento.');
      return;
    }
    
    if (joined) {
      alert('Ya estás registrado en este evento.');
      return;
    }

    setJoining(true);
    fetch('http://localhost:8080/event-registration', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ eventId: id })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al unirse al evento');
        setJoined(true);
        setAttendeesCount(prev => prev + 1); // Incrementar contador
        alert('¡Te has unido al evento exitosamente!');
      })
      .catch(err => {
        console.error('Error joining event:', err);
        alert('Error al unirse al evento: ' + err.message);
      })
      .finally(() => setJoining(false));
  };

  // Función para eliminar evento
  const handleDelete = () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.')) {
      return;
    }

    setDeleting(true);
    fetch(`http://localhost:8080/event/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar el evento');
        alert('¡Evento eliminado exitosamente!');
        navigate('/eventos');
      })
      .catch(err => {
        console.error('Error deleting event:', err);
        alert('Error al eliminar el evento: ' + err.message);
      })
      .finally(() => setDeleting(false));
  };

  // Función para formatear la fecha del evento
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString('es-ES', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric' 
    });
    const dayOfWeek = date.toLocaleDateString('es-ES', { weekday: 'long' });
    const time = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return {
      date: dateFormatted,
      fullDateTime: `${dayOfWeek}, ${time}`
    };
  };

  // Función para manejar bookmark (guardar evento)
  const handleBookmark = () => {
    // Implementar funcionalidad de bookmark aquí
    alert('Evento guardado en marcadores (funcionalidad pendiente)');
  };

  // Estados de carga y error
  if (!token) {
    return (
      <div className="error-container">
        <h2>Autenticación requerida</h2>
        <p>Debes iniciar sesión para ver los detalles del evento.</p>
        <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">🔄</div>
        <p>Cargando detalles del evento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/eventos')}>Volver a Eventos</button>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="error-container">
        <h2>Evento no encontrado</h2>
        <p>El evento que buscas no existe o ha sido eliminado.</p>
        <button onClick={() => navigate('/eventos')}>Volver a Eventos</button>
      </div>
    );
  }

  const isCreator = user && evento.creadorId === user.uid;
  const eventDate = formatEventDate(evento.fechaEvento);

  return (
    <div className="event-detail-desktop">
      {/* Sección de imagen con overlay */}
      <div className="event-image-section">
        {evento.imagenes?.length > 0 ? (
          <div className={`image-carousel ${evento.imagenes.length === 1 ? 'single-image' : ''}`}>
            <div className="image-container">
              <img 
                src={evento.imagenes[currentImageIndex]} 
                alt={`Imagen ${currentImageIndex + 1} del evento ${evento.titulo}`} 
                className="event-image"
                onError={(e) => {
                  e.target.src = '/images/default-event.jpg'; // Imagen por defecto si falla
                }}
              />
            </div>
            
            {/* Controles del carrusel - solo si hay múltiples imágenes */}
            {evento.imagenes.length > 1 && (
              <>
                <button 
                  className="carousel-btn prev-btn" 
                  onClick={prevImage}
                  aria-label="Imagen anterior"
                >
                  &#8249;
                </button>
                <button 
                  className="carousel-btn next-btn" 
                  onClick={nextImage}
                  aria-label="Siguiente imagen"
                >
                  &#8250;
                </button>
                
                {/* Indicadores de imagen */}
                <div className="image-indicators">
                  {evento.imagenes.map((_, index) => (
                    <span 
                      key={index} 
                      className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Ir a imagen ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          // Imagen por defecto si no hay imágenes
          <div className="no-image-container">
            <div className="no-image-placeholder">
              <span>📷</span>
              <p>Sin imágenes disponibles</p>
            </div>
          </div>
        )}
        
        {/* Botón de volver superpuesto */}
        <button 
          className="back-btn" 
          onClick={() => navigate('/eventos')}
          aria-label="Volver a eventos"
        >
          &#8249; Volver
        </button>
        
        {/* Botón de bookmark */}
        <button 
          className="bookmark-btn"
          onClick={handleBookmark}
          aria-label="Guardar evento"
        >
          🔖
        </button>
        
        {/* Contador de asistentes superpuesto */}
        <div className="attendees-overlay">
          <div className="attendees-counter">
            <div className="attendees-avatars">
              <div className="avatar" title="Asistente">👤</div>
              <div className="avatar" title="Asistente">👤</div>
              <div className="avatar" title="Asistente">👤</div>
            </div>
            <span className="attendees-text">+{attendeesCount} Asistiendo</span>
            {!isCreator && (
              <button 
                className="invite-btn" 
                onClick={handleJoin} 
                disabled={joining || joined}
                aria-label={joined ? "Ya unido al evento" : "Unirse al evento"}
              >
                {joining ? "..." : joined ? "✓ Unido" : "Unirse"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sección de contenido */}
      <div className="event-content-section">
        <div className="event-content">
          {/* Header del contenido */}
          <div className="content-header">
            <h1 className="event-title">{evento.titulo}</h1>
          </div>
          
          {/* Información del evento */}
          <div className="event-info-section">
            <div className="info-item">
              <div className="info-icon" aria-hidden="true">📅</div>
              <div className="info-details">
                <div className="info-title">{eventDate.date}</div>
                <div className="info-subtitle">{eventDate.fullDateTime}</div>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon" aria-hidden="true">📍</div>
              <div className="info-details">
                <div className="info-title">{evento.ubicacion || 'Ubicación no especificada'}</div>
                <div className="info-subtitle">Consultar detalles con el organizador</div>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon" aria-hidden="true">👤</div>
              <div className="info-details">
                <div className="info-title">{evento.creadorNombre || 'Organizador'}</div>
                <div className="info-subtitle">Organizador del evento</div>
              </div>
              {!isCreator && (
                <button className="follow-btn" aria-label="Seguir organizador">
                  Seguir
                </button>
              )}
            </div>
          </div>
          
          {/* Descripción del evento */}
          <div className="event-description-section">
            <h3>Acerca del Evento</h3>
            <p>
              {evento.descripcion || 
                "Únete a nosotros para disfrutar de una experiencia increíble. Este evento promete ser memorable con actividades emocionantes y la oportunidad de conocer gente nueva."
              }
            </p>
          </div>
          
          {/* Botón de acción */}
          <div className="action-buttons">
            {isCreator ? (
              <button 
                className="danger-btn delete-btn" 
                onClick={handleDelete}
                disabled={deleting}
                aria-label="Eliminar evento"
              >
                {deleting ? "Eliminando..." : "🗑️ Eliminar Evento"}
              </button>
            ) : (
              <button 
                className="primary-btn join-btn" 
                onClick={handleJoin}
                disabled={joining || joined}
                aria-label={joined ? "Ya registrado en el evento" : "Registrarse en el evento"}
              >
                {joining ? "Registrando..." : joined ? "✅ Registrado" : "Registrarse"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;