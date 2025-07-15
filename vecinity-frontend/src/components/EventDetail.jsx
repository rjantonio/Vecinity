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
  const [joined, setJoined] = useState(false); // Para mostrar feedback si ya está inscrito o tras inscribirse

  useEffect(() => {
    if (!token || !id) return;

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
      })
        .then(res => (res.ok ? res.json() : []))
    ])
      .then(([eventData, imgData]) => {
        eventData.imagenes = imgData.map(img => `data:image/jpeg;base64,${img.imagenBase64}`);
        setEvento(eventData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  // Función para unirse al evento
  const handleJoin = () => {
    if (!token) {
      alert('Debes iniciar sesión para unirte al evento.');
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
        alert('¡Te has unido al evento!');
      })
      .catch(err => alert(err.message))
      .finally(() => setJoining(false));
  };

  if (!token) return <div>Autenticación requerida para ver este evento.</div>;
  if (loading) return <div>Cargando detalles del evento...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!evento) return <div>No existe ese evento.</div>;

  const isCreator = user && evento.creadorId === user.uid;
  console.log("User ID:", user?.uid);
console.log("Evento creadorId:", evento.creadorId);


  return (
    <div className="event-detail">
      <h2>{evento.titulo}</h2>
      <p><strong>Ubicación:</strong> {evento.ubicacion}</p>
      <p><strong>Fecha:</strong> {evento.fechaEvento}</p>
      <div className="event-detail-images">
        {evento.imagenes.map((src, i) => (
          <img key={i} src={src} alt={`Imagen ${i + 1}`} className="event-detail-img" />
        ))}
      </div>
      <p>{evento.descripcion}</p>

      {isCreator ? (
        <button className="edit-event-btn" onClick={() => navigate(`/editar-evento/${id}`)}>
          Editar Evento
        </button>
      ) : (
        <button
          className="join-event-btn"
          onClick={handleJoin}
          disabled={joining || joined}
          title={joined ? "Ya estás inscrito en este evento" : "Unirse al evento"}
        >
          {joining ? "Uniendo..." : joined ? "Inscrito" : "Unirse al Evento"}
        </button>
      )}
    </div>
  );
}

export default EventDetail;
