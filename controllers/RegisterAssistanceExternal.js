//? Importamos librerías
const joi = require("@hapi/joi"),
    moment = require("moment");
const { sendMail } = require("../helpers/sendMail");
const {
    templateAssistanceRegister,
} = require("../helpers/template-assistance-register");

//* Importamos los modelos
const AssistanceExternal = require("../models/External"),
    User = require("../models/User"),
    Site = require("../models/Site");

const schemaAssistanceExternal = joi.object({
    logger: joi.string().required(),
    assistant: joi.string().required(),
    site: joi.string().required(),
    date: joi.string().required(),
    startTime: joi.string().required(),
    endTime: joi.string().required(),
    area: joi.string().required(),
    status: joi.string().required(),
});

//* Funcion para registrar una asistencia de un externo
const registerAssistanceExternal = async (req, res) => {
    // Validamos los datos de entrada con el schema
    const { error } = schemaAssistanceExternal.validate(req.body);
    // Si hay error, retornamos el error
    if (error) return res.status(400).json({ msg: error.details[0].message });
    // Buscamos el usuario
    const user = await User.findOne({ _id: req.body.logger });
    // Si no existe el usuario, retornamos el error
    if (!user) return res.status(400).json({ msg: "El usuario no existe" });
    // Verificamos que el sitio exista
    const site = await Site.findById(req.body.site);
    // Si no existe, retornamos error
    if (!site) return res.status(400).json({ msg: "Sitio no existe" });
    // Verficar que la fecha no sea menor a la fecha actual
    if (moment(req.body.date).isBefore(moment().format("YYYY-MM-DD")))
        return res.status(400).json({
            msg: "La fecha no puede ser menor a la fecha actual",
        });
    // Verificamos si la asistencia ya existe para el día y hora indicados del usuario
    const existAssistance = await AssistanceExternal.findOne({
        assistant: req.body.assistant,
        date: req.body.date,
        site: req.body.site,
    });
    // Si existe, retornamos error
    if (existAssistance)
        return res.status(400).json({
            msg: "Ya existe una asistencia para el visitante en ese día y hora",
        });
    // Verificamos que si se registra para el mismo día, la hora de inicio sea mayor a la hora actual por lo menos 15 minutos
    if (
        moment(req.body.date, "YYYY-MM-DD").format("YYYY-MM-DD") ===
            moment().format("YYYY-MM-DD") &&
        moment(req.body.startTime, "HH:mm").diff(moment(), "minutes") < 15
    )
        return res.status(400).json({
            msg: "La hora de inicio debe ser mayor a la hora actual por lo menos 15 minutos",
        });
    // Verificamos que la fecha no sea domingo
    const date = moment(req.body.date, "YYYY-MM-DD");
    if (date.day() === 0)
        return res.status(400).json({
            error: "No se pueden registrar asistencias para los domingos",
        });
    // Verificamos que si el día es sábado, la hora de salida no sea mayor a las 14:00
    if (date.day() === 6) {
        const hour = moment(req.body.endTime, "HH:mm");
        if (hour.isAfter(moment("14:00", "HH:mm")))
            return res.status(400).json({
                msg: "No se pueden registrar asistencias para los sábados con sálida después de las 14:00",
            });
    }
    // Verificamos que la hora de entrada no sea menor a las 7:00
    if (moment(req.body.startTime, "HH:mm").isBefore(moment("07:00", "HH:mm")))
        return res.status(400).json({
            msg: "La hora de entrada no puede ser menor a las 07:00",
        });
    // Verficamos que la hora de entrada no sea mayor a 18:00 excepto para el área de CM
    if (
        req.body.area !== "CM" &&
        moment(req.body.startTime, "HH:mm").isAfter(moment("18:00", "HH:mm"))
    )
        return res.status(400).json({
            msg: "La hora de entrada no puede ser mayor a las 18:00",
        });
    // Verificamos que la hora de salida no sea mayor a las 18:00 excepto para el área de CM
    if (
        req.body.area !== "CM" &&
        moment(req.body.endTime, "HH:mm").isAfter(moment("18:00", "HH:mm"))
    )
        return res.status(400).json({
            msg: "La hora de salida no puede ser mayor a las 18:00",
        });
    // Verificamos que la hora de entrada no sea igual o mayor a la hora de salida
    if (
        moment(req.body.startTime, "HH:mm").isSameOrAfter(
            moment(req.body.endTime, "HH:mm")
        )
    )
        return res.status(400).json({
            msg: "La hora de entrada no puede ser igual o mayor a la hora de salida",
        });
    // Verifcar que la asistencia no sea mayor a un mes
    if (moment(req.body.date).isAfter(moment().add(1, "month")))
        return res.status(400).json({
            msg: "La asistencia no puede ser mayor a un mes",
        });
    // Verificamos que la asistencia no se solape con otra asistencia
    const assistanceOverlap = await AssistanceExternal.find({
        assistant: req.body.assistant,
        date: req.body.date,
        $or: [
            { startTime: { $lte: req.body.startTime } },
            { endTime: { $gte: req.body.endTime } },
        ],
    });
    // Si existe una asistencia que se solape
    if (assistanceOverlap.length > 0)
        return res
            .status(400)
            .json({ msg: "La asistencia se solapa con otra asistencia" });
    // Creamos la asistencia
    const assistanceExternal = new AssistanceExternal({
        logger: req.body.logger,
        assistant: req.body.assistant,
        site: req.body.site,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        area: req.body.area,
        status: req.body.status,
    });
    // Guardamos la asistencia
    await assistanceExternal.save();
    const data = {
        loggerUsername: user.username,
        assistantName: req.body.assistant,
        siteName: site.name,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        status: req.body.status,
    };
    // Generamos template de asistencia
    const template = templateAssistanceRegister(data);
    // Mandamos correo al asistente
    sendMail(user.mail, "Asistencia registrada", template);
    // Devolvemos la asistencia
    res.status(200).json({
        msg: "Asistencia creada",
        assistance: assistanceExternal,
    });
};

module.exports = registerAssistanceExternal;
