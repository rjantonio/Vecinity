import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home__screen">
          <h1 className="home__title">Vecinity</h1>
          <p className="home__subtitle">Conectando comunidades a través de eventos solidarios</p>
            <button 
                className="home__cta__button"
                onClick={() => navigate("/eventos")}
>
                Explorar Eventos
            </button>
        </div>
  );
}

export default HomePage;