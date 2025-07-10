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
            
            console.log('=== DEBUG INFO ===');
            console.log('Token recibido:', token);
            
            // Extraer el UID del usuario del token de Firebase
            const firebaseUid = getUserIdFromToken(token);
            console.log('Firebase UID extraído:', firebaseUid);
            
            if (!firebaseUid) {
                throw new Error('No se pudo extraer el UID del usuario del token');
            }
            
            // Obtener información del usuario usando el firebaseUid
            console.log('Obteniendo información del usuario por Firebase UID...');
            let userInfo = null;
            try {
                const userInfoResponse = await fetch(`http://localhost:8080/user/${firebaseUid}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                
                if (userInfoResponse.ok) {
                    userInfo = await userInfoResponse.json();
                    console.log('✅ Información del usuario encontrada:', userInfo);
                    console.log('Rol del usuario:', userInfo.role || userInfo.roles || 'USER');
                    
                    // Verificar si el usuario tiene permisos para crear eventos
                    const userRole = userInfo.role || userInfo.roles || 'USER';
                    if (userRole !== 'ADMIN') {
                        console.warn('⚠️ El usuario no tiene rol ADMIN, pero intentando crear evento...');
                    }
                } else if (userInfoResponse.status === 404) {
                    console.warn('⚠️ Usuario no encontrado en la base de datos con Firebase UID:', firebaseUid);
                    // El usuario existe en Firebase pero no en tu base de datos
                    // Podrías crear el usuario automáticamente aquí si quieres
                } else {
                    console.log('❌ Error al obtener info del usuario:', userInfoResponse.status);
                }
            } catch (userError) {
                console.log('Error obteniendo info del usuario:', userError);
            }

            // Verificar si podemos hacer GET (para confirmar que el token funciona)
            console.log('Probando GET para verificar que el token funciona...');
            try {
                const getResponse = await fetch('http://localhost:8080/event', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                console.log('Respuesta GET:', getResponse.status);
                if (getResponse.ok) {
                    console.log('✅ El token funciona para GET');
                } else {
                    console.log('❌ El token NO funciona para GET');
                }
            } catch (getError) {
                console.log('Error en GET:', getError);
            }
            
            const dataToSend = {
                titulo: formData.titulo,
                descripcion: formData.descripcion,
                fechaEvento: formData.fechaEvento,
                ubicacion: formData.ubicacion
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
                if (response.status === 403) {
                    const userRoleInfo = userInfo ? 
                        `\n📝 Usuario encontrado: ${userInfo.email || userInfo.nombre || 'N/A'}\n📝 Rol actual: ${userInfo.role || userInfo.roles || 'USER'}` :
                        '\n❌ Usuario no encontrado en la base de datos';
                    
                    throw new Error(`❌ No tienes permisos para crear eventos.

🔧 Para solucionarlo:
1. Asegúrate de que el usuario esté registrado en tu sistema
2. Verifica que tenga rol ADMIN en la base de datos
3. O modifica el backend para permitir usuarios normales crear eventos

📝 Firebase UID: ${firebaseUid}${userRoleInfo}
📝 Error técnico: ${response.status} - Forbidden`);
                }
                
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
            
            // Limpiar formulario después del envío exitoso
            setFormData({
                titulo: '',
                descripcion: '',
                fechaEvento: '',
                ubicacion: '',
                imagenes: []
            });
            
            alert('¡Evento creado exitosamente!');
            navigate('/');
            
        } catch (error) {
            console.error('Error completo al crear evento:', error);
            alert(`Error al crear el evento: ${error.message}`);
        } finally {
            setLoading(false);
        }
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