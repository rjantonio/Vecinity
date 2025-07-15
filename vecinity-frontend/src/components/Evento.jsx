import { useState } from 'react';

function Evento({
  name = "",
  images = [],
  description = "",
  fechaEvento = "",
  ubicacion = "",
  showJoinButton = true,
  onClick, // 🆕 Añadido
}) {
  return (
    <li
      className="event__list__item"
      onClick={onClick} // 🆕 Aplicar el click
      style={{ cursor: 'pointer' }} // 🆕 Visual feedback
    >
      <h3 className="event__title">{name}</h3>
      <h4 className="event__location">{ubicacion}</h4>
      <p className="event__date">{fechaEvento}</p>

      {images && images.length > 0 && (
        <div className="event__images">
          {images.map((image, index) => (
            <img
              key={index}
              className="event__image"
              src={image}
              alt={`Imagen ${index + 1} del evento ${name}`}
              onError={(e) => {
                e.target.style.display = 'none';
                console.log('Error cargando imagen:', image);
              }}
              onLoad={() =>
                console.log(`Imagen ${index + 1} cargada correctamente`)
              }
            />
          ))}
        </div>
      )}

      <p className="event__description">{description}</p>
      {showJoinButton && (
        <button
          className="event__join__btn"
          onClick={(e) => {
            e.stopPropagation(); // Para que no dispare el onClick del <li>
            console.log("Unirse al evento");
          }}
        >
          Unirse al Evento
        </button>
      )}
    </li>
  );
}


export default Evento;