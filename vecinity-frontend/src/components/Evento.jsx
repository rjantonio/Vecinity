function Evento({ name = "", images = [], description = "", fechaEvento = "", ubicacion = "", showJoinButton = true }){
    return(
        <div>
            <h1>{name}</h1>
            <h2>{ubicacion}</h2>
            <h5>{fechaEvento}</h5>
            {images.length > 0 && images.map((img, i) => (
                <img key={i} src={img} alt={`Imagen del evento ${i + 1}`} style={{width: '200px', margin: '5px'}} />
            ))}
            <p>{description}</p>
            {showJoinButton && <button>Unirse al Evento</button>}
        </div>
    );
}

export default Evento;