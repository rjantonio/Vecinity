import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
      <div className="main-header">
          <h1>Vecinity</h1>
          <p>Unidos por una comunidad mejor</p>
              <button 
                className="home__cta__button"
                onClick={() => navigate("/eventos")}>
                Explorar Eventos
            </button>
        </div>
  );
}

export default HomePage;