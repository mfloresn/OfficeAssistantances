const templatePassword = () => {
    return `
    <!DOCTYPE html>
    <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Alertas Asistencias Norcul</title>
        </head>
        <body>
            <div style="margin: 0; padding: 0; font-family: 'Calibri'; width: 100%; background-color: rgb(0, 102, 71); padding-bottom: 10px;">
                <div style="width: 50%; margin-left: auto; margin-right: auto; text-align: center; background-color: rgb(255, 255, 255); border-radius: 0px 0px 10px 10px; padding-bottom: 10px; padding-top: 5px;">
                    <h1 style="color: rgb(0, 102, 71); margin-top: 1rem; margin-bottom: 1rem;">Asistencias Norcul</h1>
                    <h2 style="margin: 1rem;">Alertas</h2>
                    <div>
                        <h3>Cambio de contraseña<h3/>
                        <h3>Tu contraseña ha sido actualizada</h3>
                        <p>Si no fuiste tú, comunicate con el área de IT.</p>
                    <div>
                </div>
            </div>
        </body>
    </html>
    `;
};

module.exports = {
    templatePassword,
};
