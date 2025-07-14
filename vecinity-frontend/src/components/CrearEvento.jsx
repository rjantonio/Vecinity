import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import "../css/CrearEditarEvento.css";

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
                    <label className="form-label">Título del evento</label>
                    <input 
                        className="form-input"
                        type="text" 
                        name="titulo"
                        placeholder="Título del evento" 
                        value={formData.titulo}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label className="form-label">Fecha y hora</label>
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
                    <label className="form-label">Ubicación</label>
                    <input 
                        className="form-input"
                        type="text" 
                        name="ubicacion"
                        placeholder="Ubicación del evento"
                        value={formData.ubicacion}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <textarea 
                        className="form-textarea"
                        name="descripcion"
                        placeholder="Descripción del evento"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        required
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <label className="form-label">Imágenes</label>
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
                            {formData.imagenes.length > 0 
                                ? `${formData.imagenes.length} ${formData.imagenes.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}` 
                                : 'Ninguna imagen seleccionada'}
                        </span>
                    </div>
                </div>
                
                {formData.imagenes.length > 0 && (
                    <div className="image-preview-container">
                        {formData.imagenes.map((file, index) => (
                            <div key={index} className="image-preview-card">
                                <img 
                                    className="image-preview"
                                    src={URL.createObjectURL(file)} 
                                    alt={`Preview ${index}`} 
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
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="form-buttons">
                    <button 
                        className="btn-crear-evento"
                        type="submit" 
                        disabled={!formData.titulo.trim() || !formData.descripcion.trim() || !formData.fechaEvento || loading}
                    >
                        {loading ? 'Creando...' : 'Crear Evento'}
                    </button>
                    <button 
                        className="btn-volver"
                        type="button" 
                        onClick={()=>navigate("/")} 
                        disabled={loading}
                    >
                        Volver
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CrearEvento;