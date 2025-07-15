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
        setFilteredItems(eventosConImagenes); // ✅ Inicializa también la lista filtrada
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // 🔍 Lógica de filtrado por búsqueda
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

  if (!user) return <div>Por favor, inicia sesión para ver los eventos</div>;
  if (!token) return <div>Autenticando...</div>;
  if (loading) return <div>Cargando eventos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h2 className="tittle">Lista de eventos</h2>

      {/* 🔎 Barra de búsqueda */}
      <SearchBar onSearch={handleSearch} placeholder="Buscar eventos por título..." />

      {/* Mostrar resultados de búsqueda */}
      {searchTerm && (
        <p className="search-results">
          Resultados para "{searchTerm}": {filteredItems.length} eventos
        </p>
      )}

      <ul className="event__list">
        {filteredItems.map(item => (
          <Evento
            key={item.id}
            name={item.titulo}
            fechaEvento={item.fechaEvento}
            images={item.imagenes || []}
            description={item.descripcion}
            ubicacion={item.ubicacion}
            onClick={() => navigate(`/event/${item.id}`)}
          />
        ))}
      </ul>

      {searchTerm && filteredItems.length === 0 && (
        <p className="no-results">No se encontraron eventos que coincidan con tu búsqueda</p>
      )}

      <button className="create__event__btn" onClick={() => navigate("/crear-evento")}>
        Crear Evento
      </button>
      <button className="edit__event__btn" onClick={() => navigate("/editar-evento")}>
        Editar Evento
      </button>

      <EventRegistrationsList token={token} />
    </>
  );
}

export default EventList;
