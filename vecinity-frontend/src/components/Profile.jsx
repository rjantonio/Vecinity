import React, { useState, useEffect } from "react";
import "../css/UserProfile.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../utils/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

function Profile() {
  const { user, logout } = useAuth();
  const [edit, setEdit] = useState(false);
  const [profile, setProfile] = useState(null);
  const [temp, setTemp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  // Cargar datos del usuario desde Firestore
  useEffect(() => {
    if (!user) return;
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
  }, [user]);

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

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

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

  if (loading) {
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
      {/* Contenido principal del perfil */}
      <div className="profile-content-web">
        <div className="profile-card">
          {/* Botón de volver y menú en la esquina del card */}
          <div className="card-header">
            <button className="back-button" onClick={() => navigate("/")}>
              ←
            </button>
            <div className="menu-container">
              <button className="menu-button" onClick={handleMenuToggle}>
                ⋮
              </button>
              {showMenu && (
                <div className="dropdown-menu">
                  <button onClick={handleEditClick} className="menu-item">
                    ✏️ Editar perfil
                  </button>
                  <button onClick={handleDeleteClick} className="menu-item delete">
                    🗑️ Eliminar perfil
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Foto de perfil */}
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

          {/* Información del usuario */}
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
                    <span className="stat-value">Enero 2024</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Eventos creados</span>
                    <span className="stat-value">12</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Eventos asistidos</span>
                    <span className="stat-value">28</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          {edit && (
            <div className="action-buttons">
              <button className="btn-secondary" onClick={cancelEdit}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleSave}>
                Guardar Cambios
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>¿Eliminar perfil?</h3>
            <p>Esta acción no se puede deshacer. Se eliminará permanentemente tu cuenta y todos tus datos.</p>
            <div className="modal-buttons">
              <button 
                className="btn-secondary" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-danger" 
                onClick={handleDeleteProfile}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de estado */}
      {msg && (
        <div className={`message ${msg.includes('Error') ? 'error' : 'success'}`}>
          {msg}
        </div>
      )}
    </div>
  );
}

export default Profile;