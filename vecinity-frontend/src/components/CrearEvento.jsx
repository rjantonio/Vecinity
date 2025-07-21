import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/CrearEvento.css'
import { toast } from 'react-toastify';

function CrearEvento({ token }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fechaEvento: '',
        ubicacion: '',
        imagenes: []
    });

    const [loading, setLoading] = useState(false);

    const getUserIdFromToken = (token) => {
        try {
            const base64Payload = token.split('.')[1];
            const payload = JSON.parse(atob(base64Payload));
            return payload.sub;
        } catch (error) {
            console.error('Error decodificando token:', error);
            return null;
        }
    };

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
            if (!token) throw new Error('No hay token de autenticación disponible');

            const firebaseUid = getUserIdFromToken(token);
            if (!firebaseUid) throw new Error('No se pudo extraer el UID del usuario del token');

            const imagenesBase64 = await Promise.all(
                formData.imagenes.map(file => convertToBase64(file))
            );

            const dataToSend = {
                titulo: formData.titulo,
                descripcion: formData.descripcion,
                fechaEvento: formData.fechaEvento,
                ubicacion: formData.ubicacion
            };

            const response = await fetch('http://localhost:8080/event', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const result = await response.json();

            if (imagenesBase64.length > 0 && result.id) {
                for (let i = 0; i < imagenesBase64.length; i++) {
                    const imageBase64 = imagenesBase64[i];
                    const descripcion = i === 0 ? 'Imagen principal' : `Imagen ${i + 1}`;

                    const params = new URLSearchParams();
                    params.append('imagenBase64', imageBase64);
                    params.append('descripcion', descripcion);

                    const imageResponse = await fetch(`http://localhost:8080/event-images/${result.id}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: params
                    });

                    if (!imageResponse.ok) {
                        const errorText = await imageResponse.text();
                        toast.error(`Error al subir imagen ${i + 1}: ${errorText}`);
                    }
                }
            }

            setFormData({
                titulo: '',
                descripcion: '',
                fechaEvento: '',
                ubicacion: '',
                imagenes: []
            });

            toast.success('¡Evento creado exitosamente!');
            navigate('/eventos');
        } catch (error) {
            console.error('Error al crear evento:', error);
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
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

    if (!token) {
        return <div>Cargando autenticación...</div>;
    }

    return (
        <div className="crear-evento-container">
            <h2 className="crear-evento-title">Crear Evento</h2>
            <form className="crear-evento-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Título del evento</label>
                    <input
                        type="text"
                        name="titulo"
                        className="form-input"
                        value={formData.titulo}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Fecha y hora</label>
                    <input
                        type="datetime-local"
                        name="fechaEvento"
                        className="form-input"
                        value={formData.fechaEvento}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group full-width">
                    <label className="form-label">Ubicación</label>
                    <input
                        type="text"
                        name="ubicacion"
                        className="form-input"
                        value={formData.ubicacion}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group full-width">
                    <label className="form-label">Descripción</label>
                    <textarea
                        name="descripcion"
                        className="form-textarea"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        required
                    ></textarea>
                </div>

                <div className="form-group full-width">
                    <label className="form-label">Imágenes del evento</label>
                    <div className="file-input-container">
                        <label className="file-input-label">
                            Seleccionar imágenes
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="file-input"
                                onChange={handleFileChange}
                            />
                        </label>
                        <span className="file-input-text">
                            {formData.imagenes.length} archivo(s) seleccionado(s)
                        </span>
                    </div>
                </div>

                {formData.imagenes.length > 0 && (
                    <div className="form-group full-width">
                        <div className="image-preview-container">
                            {formData.imagenes.map((file, index) => (
                                <div className="image-preview-card" key={index}>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index}`}
                                        className="image-preview"
                                    />
                                    <button
                                        type="button"
                                        className="image-delete-btn"
                                        onClick={() =>
                                            setFormData(prev => ({
                                                ...prev,
                                                imagenes: prev.imagenes.filter((_, i) => i !== index)
                                            }))
                                        }
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="form-buttons">
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={!formData.titulo.trim() || !formData.descripcion.trim() || !formData.fechaEvento || loading}
                    >
                        {loading ? 'Creando...' : 'Crear Evento'}
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate("/eventos")}
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