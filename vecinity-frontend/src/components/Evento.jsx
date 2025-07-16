function Evento({
  name = "",
  images = [],
  description = "",
  fechaEvento = "",
  ubicacion = "",
  showJoinButton = true,
  onClick,
  onJoin,
  isJoined = false,
  isJoining = false,
}) {
  return (
    <li
      className="event__list__item"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
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
            />
          ))}
        </div>
      )}

      <p className="event__description">{description}</p>

      {showJoinButton && (
        <>
          {isJoined ? (
            <button
              className="event__joined__btn"
              disabled
              onClick={(e) => e.stopPropagation()}
            >
              ✔ Registrado
            </button>
          ) : (
            <button
              className="event__join__btn"
              onClick={(e) => {
                e.stopPropagation();
                if (!isJoining) onJoin();
              }}
              disabled={isJoining}
            >
              {isJoining ? "Uniendo..." : "Unirse al Evento"}
            </button>
          )}
        </>
      )}
    </li>
  );
}

export default Evento;
