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
  const [deleting, setDeleting] = useState(false); // También usado para salir

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
        return res.json(); // true o false
      })
    ])
      .then(([eventData, imgData, isRegistered]) => {
        eventData.imagenes = imgData.map(img => `data:image/jpeg;base64,${img.imagenBase64}`);
        setEvento(eventData);
        setJoined(isRegistered);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token, user?.uid]);

  // Función para unirse al evento
  const handleJoin = () => {
    if (!token) {
      alert('Debes iniciar sesión para unirte al evento.');
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
        alert('¡Te has unido al evento!');
      })
      .catch(err => alert(err.message))
      .finally(() => setJoining(false));
  };

  // Función para salir (cancelar inscripción) del evento
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

  // Función para eliminar evento (creador)
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
        navigate('/eventos'); // Redirigir a la lista de eventos
      })
      .catch(err => {
        alert('Error al eliminar el evento: ' + err.message);
      })
      .finally(() => setDeleting(false));
  };

  if (!token) return <div>Autenticación requerida para ver este evento.</div>;
  if (loading) return <div>Cargando detalles del evento...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!evento) return <div>No existe ese evento.</div>;

  const isCreator = user && evento.creadorId === user.uid;

  return (
    <div className="event-detail">
      <h2>{evento.titulo}</h2>

      <div className="event-detail-info">
        <div className="event-detail-info-item">
          <strong>📍 Ubicación</strong>
          <span>{evento.ubicacion}</span>
        </div>
        <div className="event-detail-info-item">
          <strong>📅 Fecha y Hora</strong>
          <span>{new Date(evento.fechaEvento).toLocaleString('es-ES')}</span>
        </div>
      </div>

      {evento.imagenes?.length > 0 && (
        <div className="event-detail-images">
          {evento.imagenes.map((src, i) => (
            <img key={i} src={src} alt={`Imagen ${i + 1}`} className="event-detail-img" />
          ))}
        </div>
      )}

      <div className="event-detail-description">
        <h3>📝 Descripción del Evento</h3>
        <p>{evento.descripcion}</p>
      </div>

      <div className="event-detail-actions">
        {isCreator ? (
          <>
            <button
              className="edit-event-btn"
              onClick={() => navigate(`/editar-evento/${id}`)}
              title="Editar este evento"
            >
              ✏️ Editar Evento
            </button>
            <button
              className="delete-event-btn"
              onClick={handleDelete}
              disabled={deleting}
              title="Eliminar este evento"
            >
              {deleting ? "🗑️ Eliminando..." : "🗑️ Eliminar Evento"}
            </button>
          </>
        ) : (
          joined ? (
            <button
              className="leave-event-btn"
              onClick={handleLeave}
              disabled={deleting}
              title="Cancelar inscripción"
            >
              {deleting ? "⏳ Cancelando..." : "❌ Salir del Evento"}
            </button>
          ) : (
            <button
              className="join-event-btn"
              onClick={handleJoin}
              disabled={joining}
              title="Unirse al evento"
            >
              {joining ? "⏳ Uniendo..." : "🤝 Unirse al Evento"}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default EventDetail;
