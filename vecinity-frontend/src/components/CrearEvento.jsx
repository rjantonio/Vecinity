import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import "../css/CrearEvento.css";

function CrearEvento(){
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fechaEvento: '',
        ubicacion: '',
        imagenes: []
    });
    
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            imagenes: [...prev.imagenes, ...files]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Aquí iría la lógica para enviar el evento al backend
            console.log('Datos del evento:', formData);
            
            // Simular envío
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Limpiar formulario después del envío exitoso
            setFormData({
                titulo: '',
                descripcion: '',
                fechaEvento: '',
                ubicacion: '',
                imagenes: []
            });
            
            alert('Evento creado exitosamente!');
            
        } catch (error) {
            console.error('Error al crear evento:', error);
            alert('Error al crear el evento');
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="crear-evento-container">
            <h2 className="crear-evento-title">Crear Evento</h2>
            
            <form className="crear-evento-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="titulo">Título del evento</label>
                    <input 
                        id="titulo"
                        className="form-input"
                        type="text" 
                        name="titulo"
                        placeholder="Ingresa un título atractivo" 
                        value={formData.titulo}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label className="form-label" htmlFor="fechaEvento">Fecha y hora</label>
                    <input 
                        id="fechaEvento"
                        className="form-input"
                        type="datetime-local" 
                        name="fechaEvento"
                        value={formData.fechaEvento}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label className="form-label" htmlFor="ubicacion">Ubicación</label>
                    <input 
                        id="ubicacion"
                        className="form-input"
                        type="text" 
                        name="ubicacion"
                        placeholder="¿Dónde se realizará el evento?"
                        value={formData.ubicacion}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label className="form-label" htmlFor="descripcion">Descripción</label>
                    <textarea 
                        id="descripcion"
                        className="form-textarea"
                        name="descripcion"
                        placeholder="Describe los detalles del evento"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        required
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <label className="form-label">Imágenes</label>
                    <div className="file-input-container">
                        <label className="file-input-label" htmlFor="imagenes">
                            Seleccionar imágenes
                        </label>
                        <input 
                            id="imagenes"
                            className="file-input"
                            type="file" 
                            multiple 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <span className="file-input-text">
                            {formData.imagenes.length 
                                ? `${formData.imagenes.length} ${formData.imagenes.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}`
                                : 'Ningún archivo seleccionado'}
                        </span>
                    </div>
                </div>
                
                <div className="form-buttons">
                    <button 
                        className="btn-primary"
                        type="submit" 
                        disabled={!formData.titulo.trim() || !formData.descripcion.trim() || !formData.fechaEvento || loading}
                    >
                        {loading ? 'Creando...' : 'Crear Evento'}
                    </button>
                    <button 
                        className="btn-secondary"
                        type="button" 
                        onClick={()=>navigate("/")} 
                        disabled={loading}
                    >
                        Volver
                    </button>
                </div>
            </form>
            
            {formData.imagenes.length > 0 && (
                <div className="image-preview-container">
                    <h4>Imágenes seleccionadas:</h4>
                    <div className="image-preview-container">
                        {formData.imagenes.map((file, index) => (
                            <div key={index} className="image-preview-card">
                                <img 
                                    className="image-preview"
                                    src={URL.createObjectURL(file)} 
                                    alt={`Vista previa ${index + 1}`} 
                                />
                                <button 
                                    className="image-delete-btn"
                                    type="button" 
                                    onClick={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            imagenes: prev.imagenes.filter((_, i) => i !== index)
                                        }));
                                    }}
                                    title="Eliminar imagen"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CrearEvento;