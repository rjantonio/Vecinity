import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import Evento from "./Evento";

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
            <div>
                <h2>Evento eliminado</h2>
                <button onClick={() => navigate('/')}>Volver al inicio</button>
            </div>
        );
    }

    return(
        <div>
            <h1>Editar Evento</h1>
            
            {error && (
                <div style={{ 
                    backgroundColor: '#ffebee', 
                    color: '#c62828', 
                    padding: '10px', 
                    marginBottom: '20px',
                    borderRadius: '4px',
                    border: '1px solid #ffcdd2'
                }}>
                    Error: {error}
                </div>
            )}
            
            {!modoEdicion ? (
                <div>
                    <Evento 
                        name={formData.nombre}
                        images={formData.imagenes}
                        description={formData.descripcion}
                        fechaEvento={formData.fechaEvento}
                        ubicacion={formData.ubicacion}
                        showJoinButton={false}
                    />
                    <div style={{ marginTop: '20px' }}>
                        <button 
                            onClick={() => setModoEdicion(true)}
                            disabled={loading}
                        >
                            Editar Evento
                        </button>
                        <button 
                            onClick={handleEliminarEvento}
                            disabled={loading}
                            style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}
                        >
                            {loading ? 'Eliminando...' : 'Eliminar Evento'}
                        </button>
                        <button 
                            onClick={() => navigate('/')} 
                            style={{ marginLeft: '10px' }}
                            disabled={loading}
                        >
                            Volver
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleGuardarCambios}>
                    <div>
                        <label>Nombre del evento:</label>
                        <input 
                            type="text" 
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div>
                        <label>Descripción:</label>
                        <textarea 
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div>
                        <label>Fecha del evento:</label>
                        <input 
                            type="datetime-local"
                            name="fechaEvento"
                            value={formData.fechaEvento}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div>
                        <label>Ubicación:</label>
                        <input 
                            type="text"
                            name="ubicacion"
                            value={formData.ubicacion}
                            onChange={handleInputChange}
                            placeholder="Ingresa la ubicación del evento"
                            required
                        />
                    </div>
                    
                    <div>
                        <label>Agregar imágenes:</label>
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    {formData.imagenes.length > 0 && (
                        <div>
                            <h4>Imágenes actuales:</h4>
                            {formData.imagenes.map((imagen, index) => (
                                <div key={index} style={{ display: 'inline-block', margin: '5px' }}>
                                    <img 
                                        src={imagen} 
                                        alt={`Imagen ${index + 1}`} 
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => eliminarImagen(index)}
                                        style={{ display: 'block', backgroundColor: 'red', color: 'white' }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div style={{ marginTop: '20px' }}>
                        <button 
                            type="submit"
                            disabled={!formData.nombre.trim() || !formData.descripcion.trim() || !formData.fechaEvento.trim() || !formData.ubicacion.trim() || loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button 
                            type="button" 
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