import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Evento from "./Evento";
import '../css/EditarEvento.css'
import { toast } from 'react-toastify';

function Editarevento({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventoOriginal, setEventoOriginal] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fechaEvento: "",
    ubicacion: "",
    imagenes: []
  });

  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventoEliminado, setEventoEliminado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para agregar prefijo a imágenes base64
  const formatearImagen = (imagen) => {
    if (!imagen || typeof imagen !== 'string') return imagen;
    if (imagen.startsWith('data:')) return imagen;
    if (imagen.startsWith('blob:')) return imagen;
    return `data:image/jpeg;base64,${imagen}`;
  };

  useEffect(() => {
    if (!id) {
      setError("No se especificó el ID del evento");
      return;
    }

    setLoading(true);
    setError(null);

    // Obtener datos del evento
    fetch(`http://localhost:8080/event/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al obtener evento: ${response.status}`);
        }
        return response.json();
      })
      .then(async data => {
        setEventoOriginal(data);
        console.log(data);
        
        // Obtener imágenes del evento usando el mismo método que EventList
        let imagenesFormateadas = [];
        try {
          const imgRes = await fetch(`http://localhost:8080/event-images/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          if (imgRes.ok) {
            const imagenes = await imgRes.json();
            imagenesFormateadas = imagenes.map(img => `${img.imagenBase64}`);
          }
        } catch (err) {
          console.error(`Error al obtener imágenes para evento ${id}:`, err);
          // Si falla, usar las imágenes del evento original si existen
          imagenesFormateadas = data.imagenes ? data.imagenes.map(formatearImagen) : [];
        }
        
        setFormData({
          titulo: data.titulo || "",
          descripcion: data.descripcion || "",
          fechaEvento: data.fechaEvento || "",
          ubicacion: data.ubicacion || "",
          imagenes: imagenesFormateadas
        });
        setModoEdicion(true);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
  };


  const handleFileChange = async (e) => {
  const files = Array.from(e.target.files);
  const base64List = await Promise.all(files.map(convertToBase64));
  setFormData(prev => ({
    ...prev,
    imagenes: [...prev.imagenes, ...base64List]
  }));
};


  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convertir imágenes con prefijo data: de vuelta a base64 puro
      const imagenesParaBackend = formData.imagenes
        .filter(imagen => imagen && typeof imagen === 'string') // Filtrar solo strings válidos
        .map(imagen => {
          if (imagen.startsWith('data:image/')) {
            return imagen.split(',')[1]; // Extraer solo la parte base64
          }
          return imagen;
        });

      const eventData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        fechaEvento: formData.fechaEvento,
        ubicacion: formData.ubicacion,
        imagenes: imagenesParaBackend
      };

      const response = await fetch(`http://localhost:8080/event/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify(eventData)
      });

      const imagesDto = formData.imagenes.map(b64 => ({ imagenBase64: b64, descripcion: "" }));
        await fetch(`http://localhost:8080/event-images/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify(imagesDto)
        });

      if (!response.ok) {
        throw new Error(`Error al actualizar el evento: ${response.status}`);
      }

      const result = await response.json();
      console.log('Evento actualizado:', result);
      setModoEdicion(false);
      toast.success('Evento actualizado correctamente');
      navigate(`/event/${id}`);
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      setError(error.message);
      toast.error(`Error al actualizar el evento: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarEvento = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8080/event/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined,
          }
        });

        if (!response.ok) {
          throw new Error(`Error al eliminar el evento: ${response.status}`);
        }

        console.log('Evento eliminado correctamente');
        setEventoEliminado(true);
        toast.success('Evento eliminado correctamente');
        navigate('/');
      } catch (error) {
        console.error('Error al eliminar evento:', error);
        setError(error.message);
        toast.error('Error al eliminar el evento: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelarEdicion = () => {
    if (eventoOriginal) {
      // Recargar las imágenes originales del servidor
      fetch(`http://localhost:8080/event-images/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.ok ? res.json() : [])
        .then(imagenes => {
          const imagenesFormateadas = imagenes.map(img => `data:image/jpeg;base64,${img.imagenBase64}`);
          setFormData({
            titulo: eventoOriginal.titulo,
            descripcion: eventoOriginal.descripcion,
            fechaEvento: eventoOriginal.fechaEvento,
            ubicacion: eventoOriginal.ubicacion,
            imagenes: imagenesFormateadas
          });
        })
        .catch(err => {
          console.error('Error al recargar imágenes:', err);
          // Fallback a las imágenes originales
          const imagenesFormateadas = eventoOriginal.imagenes ? eventoOriginal.imagenes.map(formatearImagen) : [];
          setFormData({
            titulo: eventoOriginal.titulo,
            descripcion: eventoOriginal.descripcion,
            fechaEvento: eventoOriginal.fechaEvento,
            ubicacion: eventoOriginal.ubicacion,
            imagenes: imagenesFormateadas
          });
        });
    }
    setModoEdicion(false);
  };

  const eliminarImagen = (index) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="editar-evento-container"><p>Cargando...</p></div>;
  }

  if (error) {
    return (
      <div className="editar-evento-container error-message" role="alert">
        <h2>Error</h2>
        <p>{error}</p>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  if (eventoEliminado) {
    return (
      <div className="editar-evento-container success-message">
        <h2>Evento eliminado</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  if (!eventoOriginal) {
    return <div className="editar-evento-container"><p>No se encontró el evento.</p></div>;
  }

  return (
    <div className="editar-evento-container">
      <h1 className="editar-evento-title">Editar Evento</h1>

      {!modoEdicion ? (
        <>
          <Evento
            name={formData.titulo}
            images={formData.imagenes}
            description={formData.descripcion}
            fechaEvento={formData.fechaEvento}
            ubicacion={formData.ubicacion}
            showJoinButton={false}
          />
          <div className="action-buttons" style={{ marginTop: '20px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setModoEdicion(true)}
              disabled={loading}
            >
              Editar Evento
            </button>
            <button
              className="btn btn-danger"
              onClick={handleEliminarEvento}
              disabled={loading}
              style={{ marginLeft: '10px' }}
            >
              {loading ? 'Eliminando...' : 'Eliminar Evento'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              style={{ marginLeft: '10px' }}
              disabled={loading}
            >
              Volver
            </button>
          </div>
        </>
      ) : (
        <form className="editar-evento-form" onSubmit={handleGuardarCambios}>
          <div className="form-group">
            <label className="form-label" htmlFor="titulo">Nombre del evento:</label>
            <input
              id="titulo"
              type="text"
              name="titulo"
              className="form-input"
              value={formData.titulo}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              className="form-textarea"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="fechaEvento">Fecha del evento:</label>
            <input
              id="fechaEvento"
              type="datetime-local"
              name="fechaEvento"
              className="form-input"
              value={formData.fechaEvento}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ubicacion">Ubicación:</label>
            <input
              id="ubicacion"
              type="text"
              name="ubicacion"
              className="form-input"
              value={formData.ubicacion}
              onChange={handleInputChange}
              placeholder="Ingresa la ubicación del evento"
              required
            />
          </div>

          <div className="form-group file-input-container">
            <label className="file-input-label" htmlFor="imagenes">Agregar imágenes:</label>
            <input
              id="imagenes"
              type="file"
              multiple
              accept="image/*"
              className="file-input"
              onChange={handleFileChange}
            />
            <span className="file-input-text">{formData.imagenes.length} imagen(es) seleccionada(s)</span>
          </div>

          {formData.imagenes.length > 0 && (
            <div className="image-gallery">
              {formData.imagenes.map((imagen, index) => (
                <div className="image-card" key={index}>
                  <img
                    src={`data:image/jpeg;base64,${imagen}`}
                    alt={`Imagen ${index + 1}`}
                    className="event-image"
                  />
                  <button
                    type="button"
                    className="delete-image-btn"
                    onClick={() => eliminarImagen(index)}
                    aria-label={`Eliminar imagen ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="action-buttons" style={{ marginTop: '20px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                !formData.titulo.trim() ||
                !formData.descripcion.trim() ||
                !formData.fechaEvento.trim() ||
                !formData.ubicacion.trim() ||
                loading
              }
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancelarEdicion}
              style={{ marginLeft: '10px' }}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Editarevento;
