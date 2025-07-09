-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS vecinitydb;
USE vecinitydb;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL, -- Para almacenar hash de contraseña
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    imagen_perfil LONGTEXT -- Para almacenar imagen en base64
);

-- Tabla de eventos
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_evento DATETIME NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_creador INT NOT NULL,
    ubicacion VARCHAR(200),
    imagen_portada LONGTEXT, -- Imagen principal en base64
    FOREIGN KEY (id_creador) REFERENCES users(id)
);

-- Tabla de inscripciones a eventos
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_evento INT NOT NULL,
    fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES users(id),
    FOREIGN KEY (id_evento) REFERENCES events(id),
    UNIQUE KEY unique_registration (id_usuario, id_evento)
);

-- Tabla para almacenar múltiples imágenes por evento
CREATE TABLE IF NOT EXISTS event_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    imagen_base64 LONGTEXT NULL,
    descripcion VARCHAR(255) NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Insertar usuarios de ejemplo
INSERT INTO users (nombre, email, contrasena, imagen_perfil) VALUES
('Alice García', 'alice@example.com', 'hashed_password1', NULL),
('Bob Martínez', 'bob@example.com', 'hashed_password2', NULL),
('Carlos López', 'carlos@example.com', 'hashed_password3', NULL);

-- Insertar eventos de ejemplo
INSERT INTO events (titulo, descripcion, fecha_evento, id_creador, ubicacion, imagen_portada) VALUES
('Concierto de verano', 'Un concierto al aire libre con bandas locales.', '2025-08-15 20:00:00', 1, 'Parque Central', NULL),
('Taller de cerámica', 'Aprende técnicas básicas de cerámica.', '2025-09-10 17:00:00', 2, 'Casa de Cultura', NULL),
('Hackathon local', 'Evento para desarrollar proyectos tecnológicos.', '2025-10-01 09:00:00', 3, 'Universidad Técnica', NULL);

-- Insertar inscripciones a eventos
INSERT INTO event_registrations (id_usuario, id_evento) VALUES
(1, 2),
(2, 1),
(3, 3);

-- Insertar imágenes de ejemplo para eventos
INSERT INTO event_images (event_id, imagen_base64, descripcion) VALUES
(1, NULL, 'Foto del escenario principal'),
(1, NULL, 'Vista aérea del concierto'),
(2, NULL, 'Materiales para cerámica'),
(3, NULL, 'Equipo trabajando en el hackathon');
