import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';

function Evento({ name = "", images = [], description = "", fechaEvento = "", ubicacion = "", showJoinButton = true }){
    return(
        <li className="event__list__item">
            <h3 className="event__title">{name}</h3>
            <h4 className="event__location">{ubicacion}</h4>
            <p className="event__date">{fechaEvento}</p>
            {images.length > 0 && images[0] && (
                <img 
                    className="event__image" 
                    src={images[0]} 
                    alt={`Imagen del evento ${name}`} 
                />
            )}
            <p className="event__description">{description}</p>
            {showJoinButton && (
                <button className="event__join__btn">
                    <FontAwesomeIcon icon={faHandshake} className="btn-icon" /> Unirse al Evento
                </button>
            )}
        </li>
    );
}

export default Evento;