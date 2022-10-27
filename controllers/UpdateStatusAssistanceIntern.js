//* Importamos los modelos
const Assistance = require("../models/Assistance"),
    User = require("../models/User"),
    Site = require("../models/Site"),
    { sendMail } = require("../helpers/sendMail"),
    templateAssistanceUpdated = require("../helpers/template-update-assistance");

//* Actualizar status de asistencia interna
const updateStatusAssistanceIntern = async (req, res) => {
    // Obtenemos la asistencia
    const assistance = await Assistance.findById(req.body.id);
    // Si no existe la asistencia
    if (!assistance)
        return res.status(400).json({ msg: "Asistencia no encontrada" });
    // Actualizar estado de asistencia
    const assistanceUpdated = await Assistance.findByIdAndUpdate(
        req.body.id,
        {
            status: req.body.status || assistance.status,
        },
        { new: true }
    );
    // Buscamos al logger
    const logger = await User.findById(assistanceUpdated.logger);
    // Buscamos al asistente
    const assistant = await User.findById(assistanceUpdated.assistant);
    // Buscamos el sitio
    const site = await Site.findById(assistanceUpdated.site);
    // Creamos la data para el correo
    const data = {
        loggerUsername: logger.username,
        assistantName: `${assistant.name} ${assistant.lastname}`,
        siteName:      site.name,
        date:          assistanceUpdated.date,
        startTime:     assistanceUpdated.startTime,
        endTime:       assistanceUpdated.endTime,
        status:        assistanceUpdated.status || assistance.status,
    };
    // Generamos el template
    const template = templateAssistanceUpdated(data);
    // Creamos el correo cc si es asistencia de terceros
    const copia = logger._id !== assistant._id ? logger.mail : null;
    // Enviamos el correo
    sendMail(assistant.mail, "Asistencia actualizada", template, copia);
    // Devolvemos la asistencia actualizada
    res.status(200).json({
        msg: "Asistencia actualizada",
        assistance: assistanceUpdated,
    });
};

module.exports = updateStatusAssistanceIntern;
