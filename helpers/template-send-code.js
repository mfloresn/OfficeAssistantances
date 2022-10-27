const generateTemplateSendMail = (code) => {
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
                        <h3>Recuperación de contraseña<h3/>
                        <h3>Código de verificación:</h3>
                        <p>Introduce el código en el campo solicitado</p>
                        <h2 class="code" style="display: block; margin-left: auto; margin-right: auto; width: 100px; background-color: rgb(0, 102, 71); color: rgb(255, 255, 255); padding: 10px; border-radius: 5px;">${code}</h2>
                    <div>
                </div>
            </div>
        </body>
    </html>
    `;
};

module.exports = {
    generateTemplateSendMail,
};
