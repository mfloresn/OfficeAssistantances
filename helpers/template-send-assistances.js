const moment = require("moment");

const templateSendAssistances = (assistances) => {
    const date = moment().format("YYYY-MM-DD");
    return `
    <!DOCTYPE html>
    <html lang="es">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="	https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css">
        <title>Alertas Asistencias Norcul</title>
        <style>
            p {
                font-size: 1.1rem;
            }
            /* Style the buttons that are used to open and close the accordion panel */
            .accordion {
                background-color: #eee;
                color: #444;
                cursor: pointer;
                padding: 18px;
                width: 100%;
                text-align: left;
                border: none;
                outline: none;
                transition: 0.4s;
            }

            /* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
            .active, .accordion:hover {
                background-color: #ccc;
            }

            /* Style the accordion panel. Note: hidden by default */
            .panel {
                padding: 0 18px;
                background-color: white;
                display: none;
                overflow: hidden;
            }
        </style>
    </head>
    
    <body>
        <div
            style="margin: 0; padding: 0; font-family: 'Calibri'; width: 100%; background-color: rgb(0, 102, 71); padding-bottom: 10px;">
            <div
                style="width: 50%; margin-left: auto; margin-right: auto; text-align: center; background-color: rgb(255, 255, 255); border-radius: 0px 0px 10px 10px; padding-bottom: 10px; padding-top: 5px;">
                <h1 style="color: rgb(0, 102, 71); margin-top: 1rem; margin-bottom: 1rem;">Asistencias Norcul</h1>
                <hr />
                <h2 style="font-weight: 300;">Asistencias a Tajín para el día ${date}</h2>
                <h2 style="font-weight: 300;">Total: ${assistances.length}</h2>
                    <div style="width: 80%; margin-left: auto; margin-right: auto;">
                        ${
                            assistances.map( assistance => {
                                return `
                                    <div>
                                        ${
                                            assistance.assistant._id 
                                                ? `<h2>${assistance.assistant.name} ${assistance.assistant.lastname} de ${assistance.startTime} a ${assistance.endTime}</h2>`
                                                : `<h2>${assistance.assistant} de ${assistance.startTime} a ${assistance.endTime}</h2>`
                                        }
                                        <div>
                                            <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                                <p>Registró: ${assistance.logger.username} - Área: ${assistance.area} - Estatús: ${assistance.status} - Fecha: ${assistance.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr style="width: 70%; margin-left: auto; margin-right: auto;">
                                `
                            }).join('')
                        }
                    </div>
            </div>
        </div>
    </body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"></script>
    
    </html>
    `;
};

module.exports = templateSendAssistances;
