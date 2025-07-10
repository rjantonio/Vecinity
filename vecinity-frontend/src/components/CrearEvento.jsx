import React, { useState } from "react";
import {useNavigate} from "react-router-dom";

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
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Crear Evento</h2>
                <input 
                    type="text" 
                    name="titulo"
                    placeholder="Título del evento" 
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                />
                <input 
                    type="datetime-local" 
                    name="fechaEvento"
                    placeholder="Fecha y hora del evento"
                    value={formData.fechaEvento}
                    onChange={handleInputChange}
                    required
                />
                <input 
                    type="text" 
                    name="ubicacion"
                    placeholder="Ubicación del evento"
                    value={formData.ubicacion}
                    onChange={handleInputChange}
                    required
                />
                <textarea 
                    name="descripcion"
                    placeholder="Descripción del evento"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    required
                ></textarea>
                <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <button 
                    type="submit" 
                    disabled={!formData.titulo.trim() || !formData.descripcion.trim() || !formData.fechaEvento || loading}
                >
                    {loading ? 'Creando...' : 'Crear Evento'}
                </button>
                <button type="button" onClick={()=>navigate("/")} disabled={loading}>
                    Volver
                </button>
            </form>
            
            {formData.imagenes.length > 0 && (
                <div>
                    <h4>Imágenes seleccionadas:</h4>
                    {formData.imagenes.map((file, index) => (
                        <div key={index} style={{ display: 'inline-block', margin: '5px' }}>
                            <img 
                                src={URL.createObjectURL(file)} 
                                alt={`Preview ${index}`} 
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                            />
                            <button 
                                type="button" 
                                onClick={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        imagenes: prev.imagenes.filter((_, i) => i !== index)
                                    }));
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CrearEvento;