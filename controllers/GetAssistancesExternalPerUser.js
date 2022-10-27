//? Importamos librerías
const moment = require("moment");

//* Importamos los modelos
const AssistanceExternal = require("../models/External"),
    User = require("../models/User");

//* Función para obtener las asistencias externas registradas por un usuario
const getExternalAssistancePerUser = async (req, res) => {
    let dateNow = moment().format("YYYY-MM-DD"),
        hourNow = moment().format("HH:mm");
    // Buscamos al usuario por su username
    const user = await User.findOne({ username: req.params.username });
    // Si no existe el usuario, retornamos error
    if (!user)
        return res.status(400).json({
            msg: "El usuario no existe",
            user: req.body.username,
        });
    // Obtenemos las asistencias del usuario
    const assistanceUser = await AssistanceExternal.find({ logger: user._id })
        .populate("logger")
        .populate("site");
    // Arrays para guardar las asistencias
    let next = [],
        inCourse = [],
        past = [],
        rejected = [];
    if (assistanceUser.length === 0) {
        return res.status(200).json({
            msg: "No hay asistencias para este usuario",
            next,
            inCourse,
            past,
            rejected,
        });
    }
    for (const assistance of assistanceUser) {
        let element = {
            id: assistance._id,
            logger: assistance.logger.username,
            assistant: assistance.assistant,
            usernameAssistant: assistance.username,
            site: assistance.site.name,
            siteId: assistance.site._id,
            date: assistance.date,
            startTime: assistance.startTime,
            endTime: assistance.endTime,
            area: assistance.area,
            status: assistance.status,
            type: "Externo",
            updatedAt: moment(assistance.updatedAt).format("YYYY-MM-DD HH:mm"),
        };
        assistance.date > dateNow
            ? next.push(element)
            : assistance.date === dateNow && assistance.startTime > hourNow
            ? next.push(element)
            : assistance.status !== "Rechazada"
            ? assistance.date === dateNow &&
              assistance.startTime < hourNow &&
              assistance.endTime > hourNow
                ? inCourse.push(element)
                : past.push(element)
            : rejected.push(element);
    }
    // Ordenamos las asistencias por fecha
    next.sort((a, b) => (a.date > b.date ? 1 : -1));
    inCourse.sort((a, b) => (a.date > b.date ? 1 : -1));
    past.sort((a, b) => (a.date > b.date ? 1 : -1));
    rejected.sort((a, b) => (a.date > b.date ? 1 : -1));
    // Devolvemos las asistencias
    res.status(200).json({
        msg: "Asistencias obtenidas",
        next,
        inCourse,
        past,
        rejected,
    });
};

//* Exportamos el módulo
module.exports = getExternalAssistancePerUser;
