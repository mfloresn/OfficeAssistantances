//? Importamos librerías
const moment = require("moment");

//* Importamos los modelos
const Assistance = require("../models/Assistance"),
    User = require("../models/User");

//* Función para obtener las asistencias de un usuario
const getAssistancesPerUser = async (req, res) => {
    let dateNow = moment().format("YYYY-MM-DD"),
        hourNow = moment().format("HH:mm");
    // Buscamos el usuario
    const user = await User.findOne({ username: req.params.username });
    // Si no existe el usuario, retornamos error
    if (!user)
        return res
            .status(400)
            .json({ error: "El usuario no existe", user: req.params.username });
    // Obtenemos las asistencias del usuario
    const assistanceUser = await Assistance.find({ assistant: user._id })
        .populate("logger")
        .populate("assistant")
        .populate("site");
    // Arrays para guardar las asistencias
    let next = [],
        inCourse = [],
        past = [],
        rejected = [];
    // Si no hay asistencias, retornamos que no hay asistencias
    if (assistanceUser.length === 0) {
        return res.status(200).json({
            msg: "No hay asistencias para este usuario",
            next,
            inCourse,
            past,
        });
    }
    for (const assistance of assistanceUser) {
        let element = {
            id: assistance._id,
            logger: assistance.logger?.username,
            assistant: `${assistance.assistant?.name} ${assistance.assistant?.lastname}`,
            assistantUser: assistance.assistant?.username,
            site: assistance.site.name,
            siteId: assistance.site._id,
            date: assistance.date,
            startTime: assistance.startTime,
            endTime: assistance.endTime,
            area: assistance.area,
            status: assistance.status,
            type: "Interno",
            updatedAt: moment(assistance.updatedAt).format("DD-MM-YYYY HH:mm"),
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
    // Devolvemos las asistencias
    res.status(200).json({
        msg: "Asistencias obtenidas",
        next,
        inCourse,
        past,
    });
};

//* Exportamos la función
module.exports = getAssistancesPerUser;
