import React, { useState, useEffect } from "react";
import "../css/UserProfile.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSlash, faSave, faEdit, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Profile() {
  const { user } = useAuth();
  const [edit, setEdit] = useState(false);
  const [profile, setProfile] = useState(null);
  const [temp, setTemp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Cargar datos del usuario desde Firestore
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const ref = doc(db, "USER", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data());
        setTemp(snap.data());
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
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      setMsg("Error al actualizar datos");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <div className="spinner"></div>
      </div>
    );
  }
  if (!profile) return <div>No hay datos de usuario.</div>;

  return (
    <div className="container__user">
      <label style={{ cursor: edit ? "pointer" : "default" }}>
        <img
          className="user__img"
          src={edit ? temp.foto : profile.foto || "https://via.placeholder.com/120"}
          alt="Foto de perfil"
        />
        {edit && (
          <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
          />
        )}
      </label>
      {edit ? (
        <input
          className="input__name"
          type="text"
          name="nombre"
          value={temp.nombre}
          onChange={handleChange}
        />
      ) : (
        <h3>{profile.nombre}</h3>
      )}
      {/* Email solo lectura y deshabilitado */}
      <input
        className="input__email"
        type="email"
        name="email"
        value={profile.email}
        readOnly
        disabled
      />
      <div style={{ display: "flex", gap: "1rem" }}>
        <button className="btn__disable__acc">
          <FontAwesomeIcon icon={faUserSlash} className="profile-btn-icon" /> Desactivar cuenta
        </button>
        <button
          className="btn__save__acc"
          onClick={edit ? handleSave : () => setEdit(true)}
        >
          <FontAwesomeIcon icon={edit ? faSave : faEdit} className="profile-btn-icon" /> {edit ? "Guardar" : "Editar"}
        </button>
        <button
          className="btn__return__list"
          onClick={() => navigate("/")}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="profile-btn-icon" /> Volver a la lista
        </button>
      </div>
      {msg && <div >{msg}</div>}
    </div>
  );
}

export default Profile;