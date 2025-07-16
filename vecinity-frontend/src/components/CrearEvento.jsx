import React, { useState } from "react";
import {useNavigate} from "react-router-dom";

function CrearEvento({ token }){
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fechaEvento: '',
        ubicacion: '',
        imagenes: []
    });
    
    const [loading, setLoading] = useState(false);

    // Función para decodificar el token JWT y extraer el UID de Firebase
    const getUserIdFromToken = (token) => {
        try {
            // Decodificar el token JWT de Firebase
            const base64Payload = token.split('.')[1];
            const payload = JSON.parse(atob(base64Payload));
            console.log('Payload completo del token:', payload);
            
            // En Firebase, el UID del usuario está en el campo 'sub'
            const uid = payload.sub;
            console.log('UID extraído de Firebase:', uid);
            
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
            if (!token) {
                throw new Error('No hay token de autenticación disponible');
            }
            
            console.log('=== CREANDO EVENTO ===');
            console.log('Token recibido:', token);
            
            // Extraer el UID del usuario del token de Firebase
            const firebaseUid = getUserIdFromToken(token);
            console.log('Firebase UID extraído:', firebaseUid);
            
            if (!firebaseUid) {
                throw new Error('No se pudo extraer el UID del usuario del token');
            }
            
            // Convertir imágenes a base64
            const imagenesBase64 = await Promise.all(
                formData.imagenes.map(file => convertToBase64(file))
            );
            
            console.log('Imágenes convertidas a base64:', imagenesBase64.length);
            
            const dataToSend = {
                titulo: formData.titulo,
                descripcion: formData.descripcion,
                fechaEvento: formData.fechaEvento,
                ubicacion: formData.ubicacion
                // Removemos images e imagenPortada de aquí
            };

            console.log('Datos a enviar:', dataToSend);

            const response = await fetch('http://localhost:8080/event', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            console.log('Respuesta POST:', response.status);
            
            if (!response.ok) {
                let errorText = '';
                try {
                    errorText = await response.text();
                } catch (readError) {
                    errorText = 'No se pudo leer el error del servidor';
                }
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Evento creado exitosamente:', result);
            
            // Enviar imágenes al endpoint separado si existen
            if (imagenesBase64.length > 0 && result.id) {
                console.log('Enviando imágenes al endpoint separado...');
                console.log('ID del evento:', result.id);
                console.log('Token para imágenes:', token);
                console.log('Número de imágenes:', imagenesBase64.length);
                
                // Enviar cada imagen por separado ya que el backend espera @RequestParam
                for (let i = 0; i < imagenesBase64.length; i++) {
                    const imageBase64 = imagenesBase64[i];
                    const descripcion = i === 0 ? 'Imagen principal' : `Imagen ${i + 1}`;
                    
                    const params = new URLSearchParams();
                    params.append('imagenBase64', imageBase64);
                    params.append('descripcion', descripcion);
                    
                    console.log(`Enviando imagen ${i + 1}/${imagenesBase64.length}`);
                    console.log('Token completo que se envía:', token);
                    console.log('Longitud del token:', token.length);
                    console.log('Primeros 50 caracteres del token:', token.substring(0, 50));
                    
                    const imageResponse = await fetch(`http://localhost:8080/event-images/${result.id}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: params
                    });
                    
                    console.log(`Respuesta imagen ${i + 1}:`, imageResponse.status);
                    
                    if (!imageResponse.ok) {
                        let imageErrorText = '';
                        try {
                            imageErrorText = await imageResponse.text();
                            console.log('Texto completo del error:', imageErrorText);
                        } catch (readError) {
                            imageErrorText = 'No se pudo leer el error del servidor';
                            console.error('Error leyendo respuesta:', readError);
                        }
                        console.error(`Error al subir imagen ${i + 1}:`, imageResponse.status, imageErrorText);
                        alert(`Advertencia: Error al subir imagen ${i + 1}: ${imageResponse.status} - ${imageErrorText}`);
                    } else {
                        const imageResult = await imageResponse.json();
                        console.log(`✅ Imagen ${i + 1} enviada exitosamente:`, imageResult);
                    }
                }
            }

            // Limpiar formulario después del envío exitoso
            setFormData({
                titulo: '',
                descripcion: '',
                fechaEvento: '',
                ubicacion: '',
                imagenes: []
            });
            
            alert('¡Evento creado exitosamente!');
            navigate('/eventos'); // Cambio de '/' a '/eventos'
            
        } catch (error) {
            console.error('Error completo al crear evento:', error);
            alert(`Error al crear el evento: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Función para convertir archivo a base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Extraer solo la parte base64 (sin el prefijo data:image/...)
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Si no hay token, mostrar mensaje
    if (!token) {
        return <div>Cargando autenticación...</div>;
    }

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
                <button type="button" onClick={()=>navigate("/eventos")} disabled={loading}>
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