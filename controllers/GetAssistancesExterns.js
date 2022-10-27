//? Importamos librerías
const moment = require("moment");

//* Importamos los modelos
const Assistance = require("../models/Assistance"),
    AssistanceExternal = require("../models/External"),
    User = require("../models/User"),
    Site = require("../models/Site");

//* Función para obtener todas las asistencias externas
const getAllAssistancesExternals = async (req, res) => {
    let dateNow = moment().format("YYYY-MM-DD"),
        hourNow = moment().format("HH:mm");
    // Obtenemos las asistencias del usuario
    const assistances = await AssistanceExternal.find()
        .populate("logger")
        .populate("site");
    // Si no hay asistencias, retornamos que no hay asistencias
    if (assistances.length === 0) {
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
    for (const assistance of assistances) {
        let element = {
            id: assistance._id,
            logger: assistance.logger?.username,
            assistant: assistance.assistant,
            site: assistance.site.name,
            siteId: assistance.site._id,
            date: assistance.date,
            startTime: assistance.startTime,
            endTime: assistance.endTime,
            area: assistance.area,
            status: assistance.status,
            type: "Externo",
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
        rejected,
    });
};

//* Exportamos la función
module.exports = getAllAssistancesExternals;
