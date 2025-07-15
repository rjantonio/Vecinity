import React, { useEffect, useState } from 'react';
//import './css/EventRegistrationsList.css'; // Opcional, si tienes estilos

function EventRegistrationsList({ token }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:8080/event-registration', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then(data => {
        setRegistrations(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (!token) return <div>Esperando autenticación...</div>;
  if (loading) return <div>Cargando inscripciones...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="enrolled__events__list">
      <h2>Inscripciones a eventos</h2>
      <ul>
        {registrations.map(reg => (
          <li key={reg.id} className="enrolled__event__item">
            Usuario ID: {reg.userId}, Evento ID: {reg.eventId}, Fecha: {reg.fechaInscripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventRegistrationsList;
