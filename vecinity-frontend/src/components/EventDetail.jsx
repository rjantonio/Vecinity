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
  const [attendeesCount, setAttendeesCount] = useState(20); // contador provisional

  useEffect(() => {
    if (!token || !id || !user?.uid) return;

    setLoading(true);

    Promise.all([
      fetch(`http://localhost:8080/event/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (!res.ok) throw new Error('No se encontró el evento');
        return res.json();
      }),
      fetch(`http://localhost:8080/event-images/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => (res.ok ? res.json() : [])),
      fetch(`http://localhost:8080/event-registration/is-registered?userId=${user.uid}&eventId=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (!res.ok) throw new Error('No se pudo verificar inscripción');
        return res.json();
      })
    ])
      .then(([eventData, imgData, isRegistered]) => {
        eventData.imagenes = imgData.map(img => `data:image/jpeg;base64,${img.imagenBase64}`);
        setEvento(eventData);
        setJoined(isRegistered);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token, user?.uid]); // ✅ CIERRE CORRECTO AQUÍ

  // Carrusel de imágenes
  const nextImage = () => {
    if (evento?.imagenes?.length > 1) {
      setCurrentImageIndex(prev => (prev === evento.imagenes.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (evento?.imagenes?.length > 1) {
      setCurrentImageIndex(prev => (prev === 0 ? evento.imagenes.length - 1 : prev - 1));
    }
  };

  const handleJoin = () => {
    if (!token) {
      toast.success('Debes iniciar sesión para unirte al evento.');
      return;
    }

    if (joined) {
      alert('Ya estás registrado en este evento.');
      return;
    }

    setJoining(true);
    fetch(`http://localhost:8080/event-registration/register?userId=${user.uid}&eventId=${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al unirse al evento');
        setJoined(true);
        setAttendeesCount(prev => prev + 1);
        alert('¡Te has unido al evento exitosamente!');
      })
      .catch(err => {
        console.error('Error joining event:', err);
        alert('Error al unirse al evento: ' + err.message);
      })
      .finally(() => setJoining(false));
  };

  const handleLeave = () => {
    if (!token) {
      alert('Debes iniciar sesión para cancelar la inscripción.');
      return;
    }
    if (!window.confirm('¿Seguro que quieres salir del evento?')) return;

    setDeleting(true);
    fetch(`http://localhost:8080/event-registration/user/${user.uid}/event/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cancelar la inscripción');
        setJoined(false);
        alert('Te has salido del evento');
      })
      .catch(err => alert(err.message))
      .finally(() => setDeleting(false));
  };

  const handleDelete = () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.')) {
      return;
    }

    setDeleting(true);
    fetch(`http://localhost:8080/event/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
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

  const handleBookmark = () => {
    alert('Evento guardado en marcadores (funcionalidad pendiente)');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  console.log(evento, user);

  return (
    <div className="event-detail-desktop">
      <div className="event-image-section">
        {evento.imagenes?.length > 0 ? (
          <div className={`image-carousel ${evento.imagenes.length === 1 ? 'single-image' : ''}`}>
            <div className="image-container">
              <img
                src={evento.imagenes[currentImageIndex]}
                alt={`Imagen ${currentImageIndex + 1} del evento ${evento.titulo}`}
                className="event-image"
                onError={(e) => {
                  e.target.src = '/images/default-event.jpg';
                }}
              />
            </div>

            {evento.imagenes.length > 1 && (
              <>
                <button className="carousel-btn prev-btn" onClick={prevImage} aria-label="Imagen anterior">
                  &#8249;
                </button>
                <button className="carousel-btn next-btn" onClick={nextImage} aria-label="Siguiente imagen">
                  &#8250;
                </button>
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
          <div className="no-image-container">
            <div className="no-image-placeholder">
              <span>📷</span>
              <p>Sin imágenes disponibles</p>
            </div>
          </div>
        )}

        <button className="back-btn" onClick={() => navigate('/eventos')} aria-label="Volver a eventos">
          &#8249; Volver
        </button>

        <button className="bookmark-btn" onClick={handleBookmark} aria-label="Guardar evento">
          🔖
        </button>

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

      <div className="event-content-section">
        <div className="event-content">
          <div className="content-header">
            <h1 className="event-title">{evento.titulo}</h1>
          </div>

          <div className="event-info-section">
          <div className="event-description-section">
            <h3>Acerca del Evento</h3>
            <p>{evento.descripcion || "Únete a nosotros para disfrutar de una experiencia increíble."}</p>
          </div>
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


          <div className="action-buttons">
            {isCreator ? (
                <div className="creator-buttons">
                <button
                    className="small-btn edit-btn"
                    onClick={() => navigate(`/editar-evento/${evento.id}`)}
                    aria-label="Editar evento"
                >
                    ✏️ Editar
                </button>

                <button
                    className="small-btn danger-btn delete-btn"
                    onClick={handleDelete}
                    disabled={deleting}
                    aria-label="Eliminar evento"
                >
                    {deleting ? "Eliminando..." : "🗑️ Eliminar"}
                </button>
                </div>
            ) : (
                <>
                {joined ? (
                    <button
                    className="exit-btn leave-btn"
                    onClick={handleLeave}
                    disabled={deleting}
                    aria-label="Salir del evento"
                    >
                    {deleting ? "Saliendo..." : "🚪 Salir del evento"}
                    </button>
                ) : (
                    <button
                    className="primary-btn join-btn"
                    onClick={handleJoin}
                    disabled={joining}
                    aria-label="Registrarse en el evento"
                    >
                    {joining ? "Registrando..." : "Registrarse"}
                    </button>
                )}
                </>
            )}
            </div>


        </div>
      </div>
    </div>
  );
}

export default EventDetail;
