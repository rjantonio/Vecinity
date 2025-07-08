import React from "react";

function Evento({ name = "", images = [], description = "" }){
    return(
        <div>
            <h2>{name}</h2>
            {images.length > 0 && images.map((img, i) => (
                <img key={i} src={img} alt={`Imagen del evento ${i + 1}`} style={{width: '200px', margin: '5px'}} />
            ))}
            <p>{description}</p>
            <button>Unirse al Evento</button>
        </div>
    );
}

export default Evento;