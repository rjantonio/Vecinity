import { useNavigate } from "react-router-dom";

function Settings(){
    const navigate = useNavigate();

    return(
            <>
              <h2>Preferencias</h2>
              <p>Aquí irán las opciones de preferencias.</p>
              <button
              className="btn__return__list"
                onClick={() => navigate("/")}
              >
                Volver a la lista
              </button>
            </>
          );
}

export default Settings;