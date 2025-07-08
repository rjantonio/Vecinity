import React, { useState } from "react";
import Evento from "./Evento";

function CrearEvento(){
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
            imagenes: imageUrls
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setEventoCreado(formData);
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
                <button type="submit">Crear Evento</button>
            </form>
            
            {eventoCreado && (
                <h3>Evento creado!</h3>
            )}
        </div>
    );
}

export default CrearEvento;