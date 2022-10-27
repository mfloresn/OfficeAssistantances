import React from "react";
import SickRoundedIcon from '@mui/icons-material/SickRounded';

const Error404 = () => {
    return(
        <div>
            <div className="error-404">
                <div className="error-404__content">
                    <div className="error-404__content__icon">
                        <SickRoundedIcon />
                    </div>
                    <div className="error-404__content__text">
                        <h1>404</h1>
                        <h2>Página no encontrada</h2>
                        <p>La página que estás buscando no se ha encontrado.</p>
                        <Button variant="contained" color="primary" href="/">
                            Volver a la página principal
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error404;
