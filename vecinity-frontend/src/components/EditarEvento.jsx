import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import Evento from "./Evento";
import "../css/CrearEditarEvento.css";

function Editarevento(){
    const navigate = useNavigate();
    
    const [eventoOriginal] = useState({
        nombre: 'Evento de ejemplo',
        descripcion: 'Esta es la descripción del evento',
        fechaEvento: '',
        ubicacion: '',
        imagenes: []
    });

    const [formData, setFormData] = useState({
        nombre: eventoOriginal.nombre,
        descripcion: eventoOriginal.descripcion,
        fechaEvento: eventoOriginal.fechaEvento,
        ubicacion: eventoOriginal.ubicacion,
        imagenes: [...eventoOriginal.imagenes]
    });

    const [modoEdicion, setModoEdicion] = useState(false);
    const [eventoEliminado, setEventoEliminado] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev, [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setFormData(prev => ({
            ...prev,
            imagenes: [...prev.imagenes, ...imageUrls]
        }));
    };

    const handleGuardarCambios = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // Preparar los datos para enviar a la API
            const eventData = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                fechaEvento: formData.fechaEvento,
                ubicacion: formData.ubicacion,
                imagenes: formData.imagenes
            };

            const response = await fetch('http://localhost:8080/event', {
                method: 'PUT', // Asumiendo que es una actualización
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar el evento: ${response.status}`);
            }

            const result = await response.json();
            console.log('Evento actualizado:', result);
            setModoEdicion(false);
            alert('Evento actualizado correctamente');
            
        } catch (error) {
            console.error('Error al actualizar evento:', error);
            setError(error.message);
            alert('Error al actualizar el evento: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminarEvento = async () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
            setLoading(true);
            setError(null);
            
            try {
                const response = await fetch('http://localhost:8080/event', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Si necesitas enviar un ID específico, puedes agregarlo aquí
                    // body: JSON.stringify({ id: eventoId })
                });

                if (!response.ok) {
                    throw new Error(`Error al eliminar el evento: ${response.status}`);
                }

                console.log('Evento eliminado correctamente');
                setEventoEliminado(true);
                alert('Evento eliminado correctamente');
                navigate('/');
                
            } catch (error) {
                console.error('Error al eliminar evento:', error);
                setError(error.message);
                alert('Error al eliminar el evento: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCancelarEdicion = () => {
        setFormData({
            nombre: eventoOriginal.nombre,
            descripcion: eventoOriginal.descripcion,
            fechaEvento: eventoOriginal.fechaEvento,
            ubicacion: eventoOriginal.ubicacion,
            imagenes: [...eventoOriginal.imagenes]
        });
        setModoEdicion(false);
    };

    const eliminarImagen = (index) => {
        setFormData(prev => ({
            ...prev,
            imagenes: prev.imagenes.filter((_, i) => i !== index)
        }));
    };

    if (eventoEliminado) {
        return (
            <div className="editar-evento-container">
                <div className="success-message">
                    <h2>Evento eliminado correctamente</h2>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>Volver al inicio</button>
                </div>
            </div>
        );
    }

    return(
        <div className="editar-evento-container">
            <h1 className="editar-evento-title">Editar Evento</h1>
            
            {error && (
                <div className="error-message">
                    Error: {error}
                </div>
            )}
            
            {!modoEdicion ? (
                <div>
                    <div className="event-preview">
                        <Evento 
                            name={formData.nombre}
                            images={formData.imagenes}
                            description={formData.descripcion}
                            fechaEvento={formData.fechaEvento}
                            ubicacion={formData.ubicacion}
                            showJoinButton={false}
                        />
                    </div>
                    <div className="action-buttons">
                        <button 
                            className="btn-crear-evento"
                            onClick={() => setModoEdicion(true)}
                            disabled={loading}
                        >
                            Editar Evento
                        </button>
                        <button 
                            className="btn btn-danger"
                            onClick={handleEliminarEvento}
                            disabled={loading}
                        >
                            {loading ? 'Eliminando...' : 'Eliminar Evento'}
                        </button>
                        <button 
                            className="btn-volver"
                            onClick={() => navigate('/')} 
                            disabled={loading}
                        >
                            Volver
                        </button>
                    </div>
                </div>
            ) : (
                <form className="editar-evento-form" onSubmit={handleGuardarCambios}>
                    <div className="form-group">
                        <label className="form-label">Nombre del evento:</label>
                        <input 
                            className="form-input"
                            type="text" 
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Descripción:</label>
                        <textarea 
                            className="form-textarea"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Fecha del evento:</label>
                        <input 
                            className="form-input"
                            type="datetime-local"
                            name="fechaEvento"
                            value={formData.fechaEvento}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Ubicación:</label>
                        <input 
                            className="form-input"
                            type="text"
                            name="ubicacion"
                            value={formData.ubicacion}
                            onChange={handleInputChange}
                            placeholder="Ingresa la ubicación del evento"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Agregar imágenes:</label>
                        <div className="file-input-container">
                            <label className="file-input-label">
                                <span>Seleccionar imágenes</span>
                                <input 
                                    className="file-input"
                                    type="file" 
                                    multiple 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                            <span className="file-input-text">
                                Selecciona nuevas imágenes para el evento
                            </span>
                        </div>
                    </div>

                    {formData.imagenes.length > 0 && (
                        <div className="form-group">
                            <label className="form-label">Imágenes actuales:</label>
                            <div className="image-gallery">
                                {formData.imagenes.map((imagen, index) => (
                                    <div key={index} className="image-card">
                                        <img 
                                            className="event-image"
                                            src={imagen} 
                                            alt={`Imagen ${index + 1}`} 
                                        />
                                        <button 
                                            className="delete-image-btn"
                                            type="button" 
                                            onClick={() => eliminarImagen(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="action-buttons">
                        <button 
                            className="btn btn-primary"
                            type="submit"
                            disabled={!formData.nombre.trim() || !formData.descripcion.trim() || !formData.fechaEvento.trim() || !formData.ubicacion.trim() || loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button 
                            className="btn-volver"
                            type="button" 
                            onClick={handleCancelarEdicion}
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