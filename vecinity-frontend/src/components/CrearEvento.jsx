import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/CrearEvento.css'

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
            const uid = payload.sub;
            return uid;
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
            if (!firebaseUid) throw new Error('No se pudo extraer el UID');

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
                    const params = new URLSearchParams();
                    params.append('imagenBase64', imagenesBase64[i]);
                    params.append('descripcion', i === 0 ? 'Imagen principal' : `Imagen ${i + 1}`);

                    const imageResponse = await fetch(`http://localhost:8080/event-images/${result.id}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: params
                    });

                    if (!imageResponse.ok) {
                        const imageErrorText = await imageResponse.text();
                        alert(`Error al subir imagen ${i + 1}: ${imageResponse.status} - ${imageErrorText}`);
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

            alert('¡Evento creado exitosamente!');
            navigate('/eventos');

        } catch (error) {
            console.error('Error completo al crear evento:', error);
            alert(`Error al crear el evento: ${error.message}`);
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
            <form onSubmit={handleSubmit} className="crear-evento-form">
                <h2 className="crear-evento-title">Crear Evento</h2>

                <div className="form-group">
                    <label htmlFor="titulo" className="form-label">Título</label>
                    <input
                        type="text"
                        name="titulo"
                        id="titulo"
                        className="form-input"
                        placeholder="Título del evento"
                        value={formData.titulo}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="fechaEvento" className="form-label">Fecha y hora</label>
                    <input
                        type="datetime-local"
                        name="fechaEvento"
                        id="fechaEvento"
                        className="form-input"
                        value={formData.fechaEvento}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="ubicacion" className="form-label">Ubicación</label>
                    <input
                        type="text"
                        name="ubicacion"
                        id="ubicacion"
                        className="form-input"
                        placeholder="Ubicación del evento"
                        value={formData.ubicacion}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <textarea
                        name="descripcion"
                        id="descripcion"
                        className="form-textarea"
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
                            Seleccionar imágenes
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="file-input"
                                onChange={handleFileChange}
                            />
                        </label>
                        <span className="file-input-text">{formData.imagenes.length} archivos seleccionados</span>
                    </div>
                </div>

                {formData.imagenes.length > 0 && (
                    <div className="image-preview-container">
                        {formData.imagenes.map((file, index) => (
                            <div key={index} className="image-preview-card">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index}`}
                                    className="image-preview"
                                />
                                <button
                                    type="button"
                                    className="image-delete-btn"
                                    onClick={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            imagenes: prev.imagenes.filter((_, i) => i !== index)
                                        }));
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
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
                        onClick={() => navigate("/")}
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
