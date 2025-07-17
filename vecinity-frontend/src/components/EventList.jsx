import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Evento from "./Evento";
import EventRegistrationsList from "./EventRegistrationsList";
import SearchBar from "./SearchBar";

function EventList({ user, token }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinedEvents, setJoinedEvents] = useState(new Set());
  const [joiningEventIds, setJoiningEventIds] = useState(new Set());

  // Cargar eventos
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
        setItems(eventosConImagenes);
        setFilteredItems(eventosConImagenes);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Cargar eventos en los que el usuario ya está inscrito
  useEffect(() => {
    if (!token || !user) return;

    fetch(`http://localhost:8080/event-registration/user/${user.uid}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener inscripciones");
        return res.json();
      })
      .then(data => {
        // Asumo que data es un array de registros, cada uno con un objeto evento con id
        const ids = new Set(data.map(reg => reg.eventId));
        setJoinedEvents(ids);
      })
      .catch(err => {
        console.error(err);
        // No interrumpir la app solo por este error
      });
  }, [token, user]);

  // Manejo del filtro de búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item =>
      item.titulo?.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredItems(filtered);
  };

  // Función para unirse a un evento
  function handleJoin(eventId) {
    if (!user || !token) {
      alert("Debes iniciar sesión para unirte al evento");
      return;
    }

    if (joinedEvents.has(eventId)) {
      alert("Ya estás inscrito en este evento");
      return;
    }

    setJoiningEventIds(prev => new Set(prev).add(eventId));

    fetch(`http://localhost:8080/event-registration/register?userId=${user.uid}&eventId=${eventId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("No se pudo unir al evento");
        return res.json();
      })
      .then(() => {
        setJoinedEvents(prev => new Set(prev).add(eventId));
        alert("¡Te has unido al evento!");
      })
      .catch(err => alert(err.message))
      .finally(() => {
        setJoiningEventIds(prev => {
          const copy = new Set(prev);
          copy.delete(eventId);
          return copy;
        });
      });
  }

  if (!user) return <div>Por favor, inicia sesión para ver los eventos</div>;
  if (!token) return <div>Autenticando...</div>;
  if (loading) return <div>Cargando eventos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h2 className="tittle">Lista de eventos</h2>

      <SearchBar onSearch={handleSearch} placeholder="Buscar eventos por título..." />

      <button className="create__event__btn" onClick={() => navigate("/crear-evento")}>
        Crear Evento
      </button>

      <ul className="event__list">
        {filteredItems.map(item => (
          <Evento
            key={item.id}
            name={item.titulo}
            fechaEvento={item.fechaEvento}
            images={item.imagenes || []}
            description={item.descripcion}
            ubicacion={item.ubicacion}
            onClick={() => {
              navigate(`/event/${item.id}`);
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            }}
            showJoinButton={true}
            onJoin={() => handleJoin(item.id)}
            isJoined={joinedEvents.has(item.id)}
            isJoining={joiningEventIds.has(item.id)}
          />
        ))}
      </ul>

      {searchTerm && filteredItems.length === 0 && (
        <p className="no-results">No se encontraron eventos que coincidan con tu búsqueda</p>
      )}
    </>
  );
}

export default EventList;
