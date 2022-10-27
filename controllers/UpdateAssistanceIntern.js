//? Importamos librerías
const moment = require("moment");
const { sendMail } = require("../helpers/sendMail");
const { templateAssistanceUpdated } = require("../helpers/template-assistance-updated");

//* Importamos los modelos
const Assistance = require("../models/Assistance"),
    User = require("../models/User"),
    Site = require("../models/Site");

//* Actualizar asistencia interna
const updateAssistanceIntern = async (req, res) => {
    // Obtenemos la asistencia
    const assistance = await Assistance.findById(req.body.id);
    // Si no existe la asistencia
    if (!assistance)
        return res.status(400).json({ msg: "Asistencia no encontrada" });
    // Buscamos al asistente
    const assistant = await User.findOne( { username: req.body.assistant } );
    // Si no existe el asistente
    if (!assistant)
        return res.status(400).json({ msg: "Asistente no encontrado" });
    // Verificar que si la asistencia es para hoy, la hora de inicio sea 15 minutos después de la hora actual
    if (
        moment(req.body.date, 'YYYY-MM-DD').format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') &&
        moment(req.body.startTime, "HH:mm").diff(moment(), "minutes") <= 13
        )
        return res.status(400).json({
            msg: 'La hora de inicio debe ser al menos 15 minutos después de la hora actual',
        });
    // Verificamos que no sea en domingo
    if (moment(req.body.date).day() === 0)
        return res
            .status(400)
            .json({ msg: "No se puede crear una asistencia en domingo" });
    // Verificamos que si el día es sábado, la hora de salida no sea mayor a las 14:00
    const date = moment(req.body.date, 'YYYY-MM-DD');
    if (date.day() === 6) {
        const hour = moment(req.body.endTime, 'HH:mm');
        if (hour.isAfter(moment('14:00', 'HH:mm')))
            return res.status(400).json({
                msg: 'No se pueden registrar asistencias para los sábados con sálida después de las 14:00.',
            });
    }
    // Verificamos que la hora de entrada no sea menor a las 7:00
    if (moment(req.body.startTime, 'HH:mm').isBefore(moment('07:00', 'HH:mm')))
        return res.status(400).json({
            msg: 'La hora de entrada no puede ser menor a las 07:00',
        });
    // Verificamos que la hora de entrada no sea mayor o igual a la hora de salida
    if (
        moment(req.body.startTime, 'HH:mm').isSameOrAfter(
            moment(req.body.endTime, 'HH:mm')
        )
    ) {
        return res.status(400).json({
            msg: 'La hora de entrada no puede ser mayor o igual a la hora de salida',
        });
    }
    // Verficamos que si el sitio es modificado a Monterrey no se acepte si proviene de otro sitio
    if (req.body.site === '62f180578ecc6b7a88f0fc76' && assistance.site !== '62f180578ecc6b7a88f0fc76')
        return res.status(400).json({
            'msg': 'No se puede modificar una asistencia de un sitio de CDMX a Monterrey Almacen',
        });
    // Verificamos que si el sitio es modificado de Monterrey a otro no se acepte
    if (assistance.site === '62f180578ecc6b7a88f0fc76' && req.body.site !== '62f180578ecc6b7a88f0fc76')
        return res.status(400).json({
            'msg': 'No se puede modificar una asistencia de un sitio de Monterrey Almacen a otro en CDMX',
        });
    // Verificamos que la asistencia no se solape con otra asistencia excepto para el área de IT
    const assistanceOverlap = await Assistance.find({
        assistant: assistant._id,
        date:      req.body.date,
        $or:       [ { startTime: { $lte: req.body.startTime } }, { endTime: { $gte: req.body.endTime } }, ],
    });
    // Si existe una asistencia que se solape
    assistanceOverlap.filter((assistance) => {
        if (assistance._id.toString() !== req.body.id.toString() && assistance.area !== 'IT')
            return res.status(400).json({
                msg: 'La asistencia se solapa con otra asistencia',
            });
    })
    // Buscamos el usuario
    const user = await User.findOne({ username: req.body.logger });
    // Si no existe el usuario
    if (!user)
        return res.status(400).json({ msg: `Usuario no encontrado` });
    // Buscamos el sitio
    const site = await Site.findById(req.body.site);
    // Si no existe el sitio
    if (!site)
        return res.status(400).json({ msg: "Sitio no encontrado" });
    // Actualizamos la asistencia
    const assistanceUpdated = await Assistance.findByIdAndUpdate(
        req.body.id,
        {
            site:            req.body.site || assistance.site,
            date:            req.body.date || assistance.date,
            startTime:       req.body.startTime || assistance.startTime,
            endTime:         req.body.endTime || assistance.endTime,
            area:            req.body.area || assistance.area,
            status:          'Pendiente',
            createdModified: moment().format('YYYY-MM-DD HH:mm'),
        },
        { new: true }
    );
    // Creamos la data para el correo
    const data = {
        loggerUsername: user.username,
        assistantName:  `${assistant.name} ${assistant.lastname}`,
        siteName:       site.name,
        date:           req.body.date,
        startTime:      req.body.startTime,
        endTime:        req.body.endTime,
        status:         'Pendiente',
    };
    // Generamos el template
    const template = templateAssistanceUpdated(data);
    // Creamos el correo cc si es asistencia de terceros
    const copia = user._id !== assistant._id ? user.mail : null;
    // Enviamos el correo
    sendMail(assistant.mail, 'Asistencia actualizada', template, copia);
    // Devolvemos la asistencia actualizada
    res.status(200).json({
        msg: "Asistencia actualizada",
        assistance: assistanceUpdated,
    });
};

// Exportamos el módulo
module.exports = updateAssistanceIntern;
