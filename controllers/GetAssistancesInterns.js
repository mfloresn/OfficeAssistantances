//? Importamos librerías
const moment = require("moment");

//* Importamos los modelos
const Assistance = require("../models/Assistance");

//* Función para obtener todas las asistencias
const getAllAssistancesInterns = async (req, res) => {
    let dateNow = moment().format("YYYY-MM-DD"),
        hourNow = moment().format("HH:mm");
    // Obtenemos las asistencias del usuario
    const assistanceUser = await Assistance.find()
        .populate("logger")
        .populate("assistant")
        .populate("site");
    // Si no hay asistencias, retornamos que no hay asistencias
    if (assistanceUser.length === 0) {
        return res.status(200).json({
            msg: "No hay asistencias para este usuario",
        });
    }
    // Arrays para guardar las asistencias
    let next = [],
        inCourse = [],
        past = [],
        rejected = [];
    // Iteramos las asistencias para separarlas por fechas
    for (const assistance of assistanceUser) {
        let element = {
            id: assistance._id,
            logger: assistance.logger?.username,
            assistant: `${assistance.assistant?.name} ${assistance.assistant?.lastname}`,
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
    // Devolvemos las asistencias
    res.status(200).json({
        msg: "Asistencias obtenidas",
        next,
        inCourse,
        past,
    });
};

//* Exportamos el módulo
module.exports = getAllAssistancesInterns;
