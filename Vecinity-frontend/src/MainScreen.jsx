import React, { useState } from "react";

function MainScreen() {
  const [view, setView] = useState("list");

  const items = [
    {
      id: 1,
      nombre: "Ejemplo de objeto",
      descripcion: "Este es un objeto de prueba con una imagen y una descripción.",
      imagen: "https://via.placeholder.com/120"
    }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#1976d2",
        color: "#fff",
        padding: "1rem 2rem"
      }}>
        <button
          onClick={() => setView("list")}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: "1.5rem",
            cursor: "pointer"
          }}
          title="Ir a la lista"
        >
          <span role="img" aria-label="lista">👤</span>
        </button>
        <div>
          <button
            onClick={() => setView("preferences")}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "1.5rem",
              cursor: "pointer",
              marginRight: "1rem"
            }}
            title="Preferencias"
          >
            <span role="img" aria-label="preferencias">⚙️</span>
          </button>
          <button
            onClick={() => setView("profile")}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "1.5rem",
              cursor: "pointer"
            }}
            title="Perfil"
          >
            <span role="img" aria-label="perfil">👤</span>
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 500, margin: "2rem auto", background: "#fff", borderRadius: 8, padding: "2rem" }}>
        {view === "list" && (
          <>
            <h2>Lista de objetos</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {items.map(item => (
                <li key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
                  <img src={item.imagen} alt={item.nombre} style={{ width: 120, height: 120, borderRadius: 8, marginRight: 16 }} />
                  <div>
                    <h3 style={{ margin: 0 }}>{item.nombre}</h3>
                    <p style={{ margin: 0 }}>{item.descripcion}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {view === "profile" && (
            <UserProfile onBack={() => setView("list")} />
        )}
        {view === "preferences" && (
          <>
            <h2>Preferencias</h2>
            <p>Aquí irán las opciones de preferencias.</p>
            <button
              style={{
                marginTop: "1rem",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "0.5rem 1rem",
                cursor: "pointer"
              }}
              onClick={() => setView("list")}
            >
              Volver a la lista
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function UserProfile({ onBack }) {
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState({
    nombre: "Nombre de Usuario",
    email: "usuario@correo.com",
    foto: "https://via.placeholder.com/120"
  });
  const [temp, setTemp] = useState(user);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setTemp(t => ({
      ...t,
      [name]: name === "foto" && files[0]
        ? URL.createObjectURL(files[0])
        : value
    }));
  };

  const handleSave = () => {
    setUser(temp);
    setEdit(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <label style={{ cursor: edit ? "pointer" : "default" }}>
        <img
          src={edit ? temp.foto : user.foto}
          alt="Foto de perfil"
          style={{ width: 120, height: 120, borderRadius: "50%", marginBottom: 16, objectFit: "cover" }}
        />
        {edit && (
          <input
            type="file"
            name="foto"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
          />
        )}
      </label>
      {edit ? (
        <input
          type="text"
          name="nombre"
          value={temp.nombre}
          onChange={handleChange}
          style={{
            marginBottom: 8,
            fontSize: "1.2rem",
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid #ccc",
            padding: "0.5rem"
          }}
        />
      ) : (
        <h3 style={{ margin: 0 }}>{user.nombre}</h3>
      )}
      {edit ? (
        <input
          type="email"
          name="email"
          value={temp.email}
          onChange={handleChange}
          style={{
            marginBottom: 16,
            fontSize: "1rem",
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid #ccc",
            padding: "0.5rem"
          }}
        />
      ) : (
        <p style={{ margin: 0, marginBottom: 16 }}>{user.email}</p>
      )}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "0.5rem 1rem",
            cursor: "pointer"
          }}
          onClick={edit ? handleSave : () => { setTemp(user); setEdit(true); }}
        >
          {edit ? "Guardar" : "Editar"}
        </button>
        <button
          style={{
            background: "#e0e0e0",
            color: "#1976d2",
            border: "none",
            borderRadius: "4px",
            padding: "0.5rem 1rem",
            cursor: "pointer"
          }}
          onClick={onBack}
        >
          Volver a la lista
        </button>
      </div>
    </div>
  );
}

export default MainScreen;