const templateAssistanceRegister = (data) => {
    const {
        assistantName,
        loggerUsername,
        siteName,
        date,
        startTime,
        endTime,
        status,
    } = data;
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
                    <hr style="width: 80%;"/>
                    <div>
                        <h2 style="font-weight: 100;">Registro éxitoso<h2/>
                        <p style="font-weight: 100;">Asistente: <b>${assistantName}</b></p>
                        <p style="font-weight: 100;">Registró: <b>${loggerUsername}</b></p>
                        <p style="font-weight: 100;">Sitio: <b>${siteName}</b></p>
                        <p style="font-weight: 100;">Fecha: <b>${date}</b></p>
                        <p style="font-weight: 100;">Horario: <b>${startTime} - ${endTime}</b></p>
                        <p style="font-weight: 100;">Estatús: <b>${status}</b></p>
                        <hr style="width: 60%; ">
                        <p>Esté al pendiente del cambio de estatús de su asistencia. :)</p>
                    <div>
                </div>
            </div>
        </body>
    </html>
    `;
};

module.exports = {
    templateAssistanceRegister,
};
