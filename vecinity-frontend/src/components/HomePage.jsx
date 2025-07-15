import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home__screen">
      <div className="home__content">
        <div className="home__hero">
          <h1 className="home__title">Vecinity</h1>
          <p className="home__subtitle">Conectando comunidades a través de eventos solidarios</p>
        </div>
        
        <div className="home__description">
          <div className="home__card">
            <h2 className="home__card__title">¿Qué es Vecinity?</h2>
            <p className="home__card__text">
              Vecinity es una plataforma diseñada para fortalecer los vínculos comunitarios 
              a través de eventos solidarios locales. Nuestra misión es conectar a los vecinos 
              y promover iniciativas que mejoren la calidad de vida en barrios y zonas específicas.
            </p>
          </div>
          
          <div className="home__card">
            <h2 className="home__card__title">Eventos que Transforman</h2>
            <p className="home__card__text">
              Desde jornadas de limpieza y reforestación hasta actividades culturales y 
              educativas, cada evento está pensado para generar un impacto positivo en 
              la comunidad y crear lazos duraderos entre los participantes.
            </p>
          </div>
          
          <div className="home__card">
            <h2 className="home__card__title">Tu Barrio, Tu Participación</h2>
            <p className="home__card__text">
              Únete a eventos cerca de ti, conoce a tus vecinos y contribuye al desarrollo 
              de tu comunidad. También puedes proponer y organizar tus propias iniciativas 
              solidarias para involucrar a más personas en causas importantes.
            </p>
          </div>
        </div>
        
        <div className="home__cta">
            <button 
                className="home__cta__button"
                onClick={() => navigate("/eventos")}
>
                Explorar Eventos
            </button>
          <p className="home__cta__text">
            Descubre eventos solidarios en tu zona y comienza a hacer la diferencia
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;