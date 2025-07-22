import React, { useState, useEffect } from "react";
import "../css/UserProfile.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../utils/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

function Profile() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const [edit, setEdit] = useState(false);
  const [profile, setProfile] = useState(null);
  const [temp, setTemp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inscripciones, setInscripciones] = useState([]);
  const [eventosInscritos, setEventosInscritos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const ref = doc(db, "USER", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data());
          setTemp(snap.data());
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [authLoading, user]);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchInscripciones = async () => {
      setLoadingEventos(true);
      try {
        const res = await fetch(`http://localhost:8080/event-registration/user/${user.uid}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        if (!res.ok) throw new Error("Error al obtener inscripciones");
        const data = await res.json();
        setInscripciones(data);

        // Traemos los detalles completos de cada evento inscrito
        const eventosData = await Promise.all(
          data.map(async (inscripcion) => {
            const resEvent = await fetch(`http://localhost:8080/event/${inscripcion.eventId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            });
            if (!resEvent.ok) throw new Error("Error al obtener evento " + inscripcion.eventId);
            return await resEvent.json();
          })
        );
        setEventosInscritos(eventosData);

      } catch (err) {
        console.error("Error cargando eventos inscritos:", err);
      } finally {
        setLoadingEventos(false);
      }
    };

    fetchInscripciones();
  }, [authLoading, user, token]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "foto" && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTemp(t => ({
          ...t,
          foto: reader.result
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setTemp(t => ({
        ...t,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      const ref = doc(db, "USER", user.uid);
      await updateDoc(ref, {
        nombre: temp.nombre,
        foto: temp.foto
      });
      setProfile({ ...temp, email: profile.email });
      setEdit(false);
      setMsg("Datos actualizados correctamente");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("Error al actualizar datos");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const ref = doc(db, "USER", user.uid);
      await deleteDoc(ref);
      await logout();
      navigate("/login");
    } catch (err) {
      setMsg("Error al eliminar el perfil");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleMenuToggle = () => setShowMenu(!showMenu);
  const handleEditClick = () => {
    setEdit(true);
    setShowMenu(false);
  };
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowMenu(false);
  };
  const cancelEdit = () => {
    setEdit(false);
    setTemp(profile);
  };

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!profile) {
    return <div className="no-data">No hay datos de usuario.</div>;
  }

  return (
    <div className="profile-container-web">
      <div className="profile-content-web">
        <div className="profile-card">
          {/* Header */}
          <div className="card-header">
            <button className="back-button" onClick={() => navigate("/")}>←</button>
            <div className="menu-container">
              <button className="menu-button" onClick={handleMenuToggle}>⋮</button>
              {showMenu && (
                <div className="dropdown-menu">
                  <button onClick={handleEditClick} className="menu-item">✏️ Editar perfil</button>
                  <button onClick={handleDeleteClick} className="menu-item delete">🗑️ Eliminar perfil</button>
                </div>
              )}
            </div>
          </div>

          {/* Foto */}
          <div className="profile-photo-section">
            <label className={`photo-label ${edit ? 'editable' : ''}`}>
              <img
                className="profile-photo"
                src={edit ? temp.foto : profile.foto || "https://via.placeholder.com/200"}
                alt="Foto de perfil"
              />
              {edit && (
                <div className="photo-overlay">
                  <span>📷</span>
                  <input
                    type="file"
                    name="foto"
                    accept="image/*"
                    onChange={handleChange}
                    className="file-input"
                  />
                </div>
              )}
            </label>
          </div>

          {/* Info */}
          <div className="profile-info">
            {edit ? (
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre completo</label>
                  <input
                    id="nombre"
                    className="name-input"
                    type="text"
                    name="nombre"
                    value={temp.nombre || ''}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre completo"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    className="email-input"
                    type="email"
                    value={profile.email}
                    disabled
                  />
                  <small className="form-help">El email no se puede modificar</small>
                </div>
              </div>
            ) : (
              <div className="profile-display">
                <h2 className="profile-name">{profile.nombre}</h2>
                <p className="profile-email">{profile.email}</p>
                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-label">Miembro desde</span>
                    <span className="stat-value">Julio 2025</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Eventos creados</span>
                    <span className="stat-value">0</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Eventos asistidos</span>
                    <span className="stat-value">{inscripciones.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          {edit && (
            <div className="action-buttons">
              <button className="btn-secondary" onClick={cancelEdit}>Cancelar</button>
              <button className="btn-primary" onClick={handleSave}>Guardar Cambios</button>
            </div>
          )}
        </div>
      </div>

      {/* Lista de eventos inscritos */}
      <div className="inscripciones-container">
        <h3>Eventos a los que estás inscrito</h3>
        {loadingEventos ? (
          <p>Cargando eventos...</p>
        ) : eventosInscritos.length === 0 ? (
          <p>No estás inscrito a ningún evento.</p>
        ) : (
          <div className="eventos-list">
            {eventosInscritos.map((evento) => (
              <div
                key={evento.id}
                className="evento-tarjeta"
                onClick={() => navigate(`/event/${evento.id}`)}
              >
                <div className="evento-imagen-wrapper">
                  {evento.imagenes && evento.imagenes.length > 0 ? (
                    <img
                      src={`data:image/jpeg;base64,${evento.imagenes[0].imagenBase64}`}
                      alt={evento.imagenes[0].descripcion || "Imagen del evento"}
                      className="evento-imagen"
                    />
                  ) : (
                    <img
                      src="/default-event.jpg"
                      alt="Evento"
                      className="evento-imagen"
                    />
                  )}
                </div>
                <div className="evento-detalles">
                  <p className="evento-fecha">📅 {new Date(evento.fechaEvento).toLocaleDateString()}</p>
                  <h4 className="evento-nombre">{evento.titulo}</h4>
                  <button className="evento-boton">Ver evento →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal eliminar */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>¿Eliminar perfil?</h3>
            <p>Esta acción no se puede deshacer.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              <button className="btn-danger" onClick={handleDeleteProfile}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {msg && <div className="msg">{msg}</div>}
    </div>
  );
}

export default Profile;
