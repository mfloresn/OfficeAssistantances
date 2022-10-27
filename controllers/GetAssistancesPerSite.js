//? Importamos librerías
const moment = require("moment");

//* Importamos los modelos
const Assistance = require("../models/Assistance"),
    AssistanceExternal = require("../models/External"),
    Site = require("../models/Site");

//* Función para obtener las asistencias internas de un sitio
const getAssistancesPerSite = async (req, res) => {
    // Buscamos al sitio por su nombre
    const site = await Site.findOne({ name: req.params.site });
    // Si no existe el sitio, retornamos error
    if (!site) return res.status(400).json({ msg: "El sitio no existe" });
    // Creamos variables para la fecha y hora actual
    let dateNow = moment().format("YYYY-MM-DD"),
        hourNow = moment().format("HH:mm");
    // Arrays para almacenar las asistencias
    let next = [],
        inCourse = [],
        past = [],
        rejected = [];
    // Obtenemos las asistencias internas del sitio
    const assistanceSite = await Assistance.find({ site: site._id })
        .populate("logger")
        .populate("assistant")
        .populate("site");
    // Iteramos sobre las asistencias, para filtrarlas por fecha y hora, y devolverlas
    for (const assistance of assistanceSite) {
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
            updatedAt: moment(assistance.updatedAt).format("DD-MM-YYYY HH:mm"),
            type: "Interno",
        };
        assistance.date > dateNow
            ? next.push(element)
            : assistance.date === dateNow && assistance.startTime > hourNow
            ? next.push(element)
            : assistance.date === dateNow &&
              assistance.startTime < hourNow &&
              assistance.endTime > hourNow
            ? inCourse.push(element)
            : past.push(element);
    }
    // Obtenemos las asistencias externas del sitio
    const assistanceSiteExternal = await AssistanceExternal.find({
        site: site._id,
    })
        .populate("logger")
        .populate("site");
    // Iteramos sobre las asistencias, para filtrarlas por fecha y hora, y devolverlas
    for (const assistance of assistanceSiteExternal) {
        let element = {
            id: assistance._id,
            logger: assistance.logger?.username,
            assistant: assistance.assistant,
            site: assistance.site.name,
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

//* Exportamos el módulo
module.exports = getAssistancesPerSite;
