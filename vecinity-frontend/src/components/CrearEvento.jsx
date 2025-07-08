import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import Evento from "./Evento";

function CrearEvento(){
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        imagenes: []
    });
    const [eventoCreado, setEventoCreado] = useState(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setEventoCreado(formData);
        setFormData({
            nombre: '',
            descripcion: '',
            imagenes: []
        });
    };

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Crear Evento</h2>
                <input 
                    type="text" 
                    name="nombre"
                    placeholder="Nombre del evento" 
                    value={formData.nombre}
                    onChange={handleInputChange}
                />
                <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <textarea 
                    name="descripcion"
                    placeholder="Descripción del evento"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                ></textarea>
                <button 
                    type="submit" 
                    disabled={!formData.nombre.trim() || !formData.descripcion.trim()}
                >
                    Crear Evento
                </button>
                <button onClick={()=>navigate("/")}>Volver</button>
            </form>
            
            {eventoCreado && (
                <h3>Evento creado!</h3>
            )}
            
            {formData.imagenes.length > 0 && (
                <div>
                    <h4>Imágenes seleccionadas:</h4>
                    {formData.imagenes.map((imagen, index) => (
                        <div key={index} style={{ display: 'inline-block', margin: '5px' }}>
                            <img src={imagen} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
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