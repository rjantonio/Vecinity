//editarlo, borrar
import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import Evento from "./Evento";

function Editarevento(){
    const navigate = useNavigate();
    
    const [eventoOriginal] = useState({
        nombre: 'Evento de ejemplo',
        descripcion: 'Esta es la descripción del evento',
        imagenes: []
    });

    const [formData, setFormData] = useState({
        nombre: eventoOriginal.nombre,
        descripcion: eventoOriginal.descripcion,
        imagenes: [...eventoOriginal.imagenes]
    });

    const [modoEdicion, setModoEdicion] = useState(false);
    const [eventoEliminado, setEventoEliminado] = useState(false);

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

    const handleGuardarCambios = (e) => {
        e.preventDefault();
        // Aquí harías la llamada a la API para actualizar el evento
        console.log('Evento actualizado:', formData);
        setModoEdicion(false);
        alert('Evento actualizado correctamente');
    };

    const handleEliminarEvento = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
            // Aquí harías la llamada a la API para eliminar el evento
            setEventoEliminado(true);
            alert('Evento eliminado correctamente');
            navigate('/');
        }
    };

    const handleCancelarEdicion = () => {
        setFormData({
            nombre: eventoOriginal.nombre,
            descripcion: eventoOriginal.descripcion,
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
            
            {!modoEdicion ? (
                <div>
                    <Evento 
                        name={formData.nombre}
                        images={formData.imagenes}
                        description={formData.descripcion}
                    />
                    <div style={{ marginTop: '20px' }}>
                        <button onClick={() => setModoEdicion(true)}>
                            Editar Evento
                        </button>
                        <button 
                            onClick={handleEliminarEvento}
                            style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}
                        >
                            Eliminar Evento
                        </button>
                        <button onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>
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
                            disabled={!formData.nombre.trim() || !formData.descripcion.trim()}
                        >
                            Guardar Cambios
                        </button>
                        <button 
                            type="button" 
                            onClick={handleCancelarEdicion}
                            style={{ marginLeft: '10px' }}
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