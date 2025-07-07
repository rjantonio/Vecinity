import react from "react";
import { useNavigate } from "react-router-dom";
import Error from "../images/error-404.png"

function ErrorScreen(){
    return(
        <div style={{ width: "100vw", height: "100vh" }}>
            <img
                src={Error}
                alt="Error 404"
                style={{
                    width: "100vw",
                    height: "100vh",
                    objectFit: "contain",
                    display: "block"
                }}
            />
        </div>
    );
}

export default ErrorScreen;