//? Importamos librerías
const joi = require('@hapi/joi'),
    moment = require('moment');

//* Importamos los modelos
const Assistance = require('../models/Assistance'),
    AssistanceExternal = require('../models/External'),
    User = require('../models/User'),
    Site = require('../models/Site');

//* Schema para validar los datos de entrada
const schemaAssistance = joi.object({
    logger: joi.string().required(),
    assistant: joi.string().required(),
    site: joi.string().required(),
    date: joi.string().required(),
    startTime: joi.string().required(),
    endTime: joi.string().required(),
    status: joi.string().required(),
});

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

//* Función para registrar una asistencia
const registerAssistance = async (req, res) => {
    try {
        // Validamos los datos de entrada con el schema
        const { error } = schemaAssistance.validate(req.body);
        // Si hay error, retornamos el error
        if (error)
            return res.status(400).json({ msg: error.details[0].message });
        // Verificamos que el asistente exista
        const assistant = await User.findOne({ username: req.body.assistant });
        // Si no existe, retornamos error
        if (!assistant)
            return res.status(400).json({ msg: 'Asistente no existe' });
        // Verificamos si la asistencia ya existe para el día y hora indicados del usuario
        const existAssistance = await Assistance.findOne({
            assistant: assistant._id,
            date:      req.body.date,
            site:      req.body.site,
        });
        // Si existe, retornamos error
        if (existAssistance)
            return res.status(400).json({
                msg: 'Ya existe una asistencia para ese día en el sitio',
            });
        // Verificar que si la asistencia es para hoy, la hora de inicio sea 15 minutos después de la hora actual
        if (
            moment(req.body.date, 'YYYY-MM-DD').format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') &&
            moment(req.body.startTime, "HH:mm").diff(moment(), "minutes") <= 13
            )
            return res.status(400).json({
                msg: 'La hora de inicio debe ser al menos 15 minutos después de la hora actual',
            });
        // Verificamos que la fecha no sea domingo
        const date = moment(req.body.date, 'YYYY-MM-DD');
        if (date.day() === 0)
            return res.status(400).json({
                msg: 'No se pueden registrar asistencias para los domingos',
            });
        // Verificamos que si el día es sábado, la hora de salida no sea mayor a las 14:00
        if (date.day() === 6) {
            const hour = moment(req.body.endTime, 'HH:mm');
            if (hour.isAfter(moment('14:00', 'HH:mm')))
                return res.status(400).json({
                    msg: 'No se pueden registrar asistencias para los sábados con sálida después de las 14:00.',
                });
        }
        // Verificamos que la hora de entrada no sea mayor a las 18:00 excepto para el área de CM
        if ( req.body.area !== 'CM' && moment(req.body.startTime, 'HH:mm').isAfter(moment('18:00', 'HH:mm')))
            return res.status(400).json({
                msg: 'La hora de entrada no puede ser mayor a las 18:00',
            });
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
        // Verificamos que la asistencia no se solape con otra asistencia excepto para el área de IT
        if( assistant.area !== 'IT' ) {
            const assistanceOverlap = await Assistance.find({
                assistant: assistant._id,
                date:      req.body.date,
                $or:       [ { startTime: { $lte: req.body.startTime } }, { endTime: { $gte: req.body.endTime } }, ],
            });
            // Si existe una asistencia que se solape
            if (assistanceOverlap.length > 0 && req.body.area !== 'IT' )
                return res
                    .status(400)
                    .json({ msg: 'La asistencia se solapa con otra asistencia' });
        }
        // Creamos la asistencia
        const assistance = new Assistance({
            logger:    req.body.logger,
            assistant: assistant._id,
            site:      req.body.site,
            date:      req.body.date,
            startTime: req.body.startTime,
            endTime:   req.body.endTime,
            area:      assistant.area,
            status:    req.body.status,
        });
        // Guardamos la asistencia
        await assistance.save();
        // Devolvemos la asistencia
        res.status(200).json({
            msg: 'Asistencia creada',
            assistance,
        });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

//* Función para borrar una asistencia
const deleteAssistance = async (req, res) => {
    // Comprobamos que la asistencia existe
    const assistance = await Assistance.findById(req.body.id);
    // Si no existe, retornamos error
    if (!assistance)
        return res.status(400).json({ msg: 'Asistencia no existe' });
    // Buscamos el logger por su username
    const logger = await User.findOne({ username: req.body.logger });
    // Si no existe, retornamos error
    if (!logger) return res.status(400).json({ msg: 'Logger no existe' });
    // Borramos la asistencia
    await Assistance.findByIdAndDelete(req.body.id);
    // Devolvemos mensaje de éxito
    res.status(200).json({ msg: 'Asistencia borrada' });
};

//* Funcion para registrar una asistencia de un externo
const registerAssistanceExternal = async (req, res) => {
    try {
        // Validamos los datos de entrada con el schema
        const { error } = schemaAssistanceExternal.validate(req.body);
        // Si hay error, retornamos el error
        if (error) 
            return res.status(400).json({ msg: error.details[0].message });
        // Verificamos si la asistencia ya existe para el día y hora indicados del usuario
        const existAssistance = await AssistanceExternal.findOne({
            assistant: req.body.assistant,
            date: req.body.date,
            site: req.body.site,
        });
        // Si existe, retornamos error
        if (existAssistance)
            return res.status(400).json({
                msg: 'Ya existe una asistencia para el visitante en ese día y hora',
            });
        // Verificamos que si se registra para el mismo día, la hora de inicio sea mayor a la hora actual por lo menos 15 minutos
        if (
            moment(req.body.date, 'YYYY-MM-DD').format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') &&
            moment(req.body.startTime, "HH:mm").diff(moment(), "minutes") < 15
        )
            return res.status(400).json({
                msg:
                    'La hora de inicio debe ser mayor a la hora actual por lo menos 15 minutos',
            });
        // Verificamos que la fecha no sea domingo
        const date = moment(req.body.date, 'YYYY-MM-DD');
        if (date.day() === 0)
            return res.status(400).json({
                error: 'No se pueden registrar asistencias para los domingos',
            });
        // Verificamos que si el día es sábado, la hora de salida no sea mayor a las 14:00
        if (date.day() === 6) {
            const hour = moment(req.body.endTime, 'HH:mm');
            if (hour.isAfter(moment('14:00', 'HH:mm')))
                return res.status(400).json({
                    msg: 'No se pueden registrar asistencias para los sábados con sálida después de las 14:00',
                });
        }
        // Verificamos que la hora de entrada no sea menor a las 7:00
        if (moment(req.body.startTime, 'HH:mm').isBefore(moment('07:00', 'HH:mm')))
            return res.status(400).json({
                msg: 'La hora de entrada no puede ser menor a las 07:00',
            });
        // Verficamos qu la hora de entrada no sea mayor a 18:00 excepto para el área de CM
        if ( req.body.area !== 'CM' && moment(req.body.startTime, 'HH:mm').isAfter(moment('18:00', 'HH:mm'))) 
            return res.status(400).json({
                msg: 'La hora de entrada no puede ser mayor a las 18:00',
            });
        // Verificamos que la hora de salida no sea mayor a las 18:00 excepto para el área de CM
        if (
            req.body.area !== 'CM' &&
            moment(req.body.endTime, 'HH:mm').isAfter(moment('18:00', 'HH:mm'))
        )
            return res.status(400).json({
                msg: 'La hora de salida no puede ser mayor a las 18:00',
            });
        // Verificamos que la hora de entrada no sea igual o mayor a la hora de salida
        if (
            moment(req.body.startTime, 'HH:mm').isSameOrAfter(
                moment(req.body.endTime, 'HH:mm') )
        )
            return res.status(400).json({
                msg: 'La hora de entrada no puede ser igual o mayor a la hora de salida',
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
                .json({ msg: 'La asistencia se solapa con otra asistencia' });
        // Creamos la asistencia
        const assistanceExternal = new AssistanceExternal({
            logger:    req.body.logger,
            assistant: req.body.assistant,
            site:      req.body.site,
            date:      req.body.date,
            startTime: req.body.startTime,
            endTime:   req.body.endTime,
            area:      req.body.area,
            status:    req.body.status,
        });
        // Guardamos la asistencia
        await assistanceExternal.save();
        // Devolvemos la asistencia
        res.status(200).json({
            msg: 'Asistencia creada',
            assistance: assistanceExternal,
        });
    } catch (error) {
        res.status(400).json(error);
    }
};

//* Función para borrar una asistencia de un externo
const deleteAssistanceExternal = async (req, res) => {
    // Comprobamos que la asistencia existe
    const assistance = await AssistanceExternal.findById(req.body.id);
    // Si no existe, retornamos error
    if (!assistance)
        return res.status(400).json({ msg: 'Asistencia no existe' });
    // Buscamos el logger por su username
    const logger = await User.findOne({ username: req.body.logger });
    // Si no existe, retornamos error
    if (!logger) return res.status(400).json({ msg: 'Logger no existe' });
    // Borramos la asistencia
    await AssistanceExternal.findByIdAndDelete(req.body.id);
    // Devolvemos mensaje de éxito
    res.status(200).json({ msg: 'Asistencia borrada' });
};

//* Función para obtener todas las asistencias
const getAllAssistancesInterns = async (req, res) => {
    let dateNow = moment().format('YYYY-MM-DD'),
        hourNow = moment().format('HH:mm');
    // Obtenemos las asistencias del usuario
    const assistanceUser = await Assistance.find()
        .populate('logger')
        .populate('assistant')
        .populate('site');
    // Si no hay asistencias, retornamos que no hay asistencias
    if (assistanceUser.length === 0) {
        return res.status(200).json({
            msg: 'No hay asistencias para este usuario',
        });
    }
    // Arrays para guardar las asistencias
    let next = [],
        inCourse = [],
        past = [];
    // Iteramos las asistencias para separarlas por fechas
    for (const assistance of assistanceUser) {
        let element = {
            id: assistance._id,
            logger: assistance.logger.username,
            assistant: `${assistance.assistant?.name} ${assistance.assistant?.lastname}`,
            site: assistance.site.name,
            date: assistance.date,
            startTime: assistance.startTime,
            endTime: assistance.endTime,
            area: assistance.area,
            status: assistance.status,
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
    // Devolvemos las asistencias
    res.status(200).json({
        msg: 'Asistencias obtenidas',
        next,
        inCourse,
        past,
    });
};

//* Función para obtener todas las asistencias externas
const getAllAssistancesExternals = async (req, res) => {
    let dateNow = moment().format('YYYY-MM-DD'),
        hourNow = moment().format('HH:mm');
    // Obtenemos las asistencias del usuario
    const assistanceUser = await AssistanceExternal.find()
        .populate('logger')
        .populate('site');
    // Si no hay asistencias, retornamos que no hay asistencias
    if (assistanceUser.length === 0) {
        return res.status(200).json({
            msg: 'No hay asistencias para este usuario',
        });
    }
    // Arrays para guardar las asistencias
    let next = [],
        inCourse = [],
        past = [];
    // Iteramos las asistencias para separarlas por fechas
    for (const assistance of assistanceUser) {
        let element = {
            id: assistance._id,
            logger: assistance.logger.username,
            assistant: assistance.assistant,
            site: assistance.site.name,
            date: assistance.date,
            startTime: assistance.startTime,
            endTime: assistance.endTime,
            area: assistance.area,
            status: assistance.status,
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
    // Devolvemos las asistencias
    res.status(200).json({
        msg: 'Asistencias obtenidas',
        next,
        inCourse,
        past,
    });
};

//* Función para obtener las asistencias de un usuario
const getAssistancesPerUser = async (req, res) => {
    let dateNow = moment().format('YYYY-MM-DD'),
        hourNow = moment().format('HH:mm');
    // Buscamos el usuario
    const user = await User.findOne({ username: req.params.username });
    // Si no existe el usuario, retornamos error
    if (!user)
        return res
            .status(400)
            .json({ error: 'El usuario no existe', user: req.params.username });
    // Obtenemos las asistencias del usuario
    const assistanceUser = await Assistance.find({ assistant: user._id })
        .populate('logger')
        .populate('assistant')
        .populate('site');
    // Arrays para guardar las asistencias
    let next = [],
        inCourse = [],
        past = [];
    // Si no hay asistencias, retornamos que no hay asistencias
    if (assistanceUser.length === 0) {
        return res.status(200).json({
            msg: 'No hay asistencias para este usuario',
            next,
            inCourse,
            past,
        });
    }
    // Iteramos las asistencias para separarlas por fechas
    for (const assistance of assistanceUser) {
        let element = {
            id: assistance._id,
            logger: assistance.logger.username,
            assistant: `${assistance.assistant?.name} ${assistance.assistant?.lastname}`,
            assistantUser: assistance.assistant?.username,
            site: assistance.site.name,
            date: assistance.date,
            startTime: assistance.startTime,
            endTime: assistance.endTime,
            area: assistance.area,
            status: assistance.status,
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
    // Ordenamos las asistencias por fecha
    next.sort((a, b) => (a.date > b.date ? 1 : -1));
    inCourse.sort((a, b) => (a.date > b.date ? 1 : -1));
    past.sort((a, b) => (a.date > b.date ? 1 : -1));
    // Devolvemos las asistencias
    res.status(200).json({
        msg: 'Asistencias obtenidas',
        next,
        inCourse,
        past,
    });
};

//* Función para obtener las asistencias de otro usuario registrada por un usuario
const getThirdPartyAssistancePerUser = async (req, res) => {
    let dateNow = moment().format('YYYY-MM-DD'),
        hourNow = moment().format('HH:mm');
    // Buscamos al usuario por su username
    const user = await User.findOne({ username: req.params.username });
    // Si no existe el usuario, retornamos error
    if (!user)
        return res.status(400).json({
            msg: 'El usuario no existe',
            user: req.body.username,
        });
    // Obtenemos las asistencias del usuario
    const assistanceUser = await Assistance.find({ logger: user._id })
        .populate('logger')
        .populate('assistant')
        .populate('site');
    let next = [],
        inCourse = [],
        past = [];
    if (assistanceUser.length === 0)
        return res.status(200).json({
            msg: 'No hay asistencias para este usuario',
            next,
            inCourse,
            past,
        });
    // Devolvemos las asistencias
    for (const assistance of assistanceUser) {
        let element = {
            id: assistance._id,
            logger: assistance.logger.username,
            assistant: `${assistance.assistant?.name} ${assistance.assistant?.lastname}`,
            usernameAssistant: assistance.assistant?.username,
            site: assistance.site.name,
            date: assistance.date,
            startTime: assistance.startTime,
            endTime: assistance.endTime,
            area: assistance.area,
            status: assistance.status,
        };
        assistance.logger.id !== assistance.assistant?.id
            ? assistance.date > dateNow
                ? next.push(element)
                : assistance.date === dateNow && assistance.startTime > hourNow
                ? next.push(element)
                : assistance.date === dateNow &&
                  assistance.startTime < hourNow &&
                  assistance.endTime > hourNow
                ? inCourse.push(element)
                : past.push(element)
            : null;
    }
    // Ordenamos las asistencias por fecha
    next.sort((a, b) => (a.date > b.date ? 1 : -1));
    inCourse.sort((a, b) => (a.date > b.date ? 1 : -1));
    past.sort((a, b) => (a.date > b.date ? 1 : -1));
    // Devolvemos las asistencias
    res.status(200).json({
        msg: 'Asistencias obtenidas',
        next,
        inCourse,
        past,
        user: req.body.username,
    });
};

//* Función para obtener las asistencias externas registradas por un usuario
const getExternalAssistancePerUser = async (req, res) => {
    let dateNow = moment().format('YYYY-MM-DD'),
        hourNow = moment().format('HH:mm');
    // Buscamos al usuario por su username
    const user = await User.findOne({ username: req.params.username });
    // Si no existe el usuario, retornamos error
    if (!user)
        return res.status(400).json({
            msg: 'El usuario no existe',
            user: req.body.username,
        });
    // Obtenemos las asistencias del usuario
    const assistanceUser = await AssistanceExternal.find({ logger: user._id })
        .populate('logger')
        .populate('site');
    // Arrays para guardar las asistencias
    let next = [],
        inCourse = [],
        past = [];
    if (assistanceUser.length === 0) {
        return res.status(200).json({
            msg: 'No hay asistencias para este usuario',
            next,
            inCourse,
            past,
        });
    }
    for (const assistance of assistanceUser) {
        let element = {
            id: assistance._id,
            logger: assistance.logger.username,
            assistant: assistance.assistant,
            usernameAssistant: assistance.username,
            site: assistance.site.name,
            date: assistance.date,
            startTime: assistance.startTime,
            endTime: assistance.endTime,
            area: assistance.area,
            status: assistance.status,
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
    // Ordenamos las asistencias por fecha
    next.sort((a, b) => (a.date > b.date ? 1 : -1));
    inCourse.sort((a, b) => (a.date > b.date ? 1 : -1));
    past.sort((a, b) => (a.date > b.date ? 1 : -1));
    // Devolvemos las asistencias
    res.status(200).json({
        msg: 'Asistencias obtenidas',
        next,
        inCourse,
        past,
    });
};

//* Función para obtener las asistencias internas de un sitio
const getAssistancesInternsPerSite = async (req, res) => {
    // Buscamos al sitio por su nombre
    const site = await Site.findOne({ name: req.params.site });
    // Si no existe el sitio, retornamos error
    if (!site) return res.status(400).json({ msg: 'El sitio no existe' }); 
    // Creamos variables para la fecha y hora actual
    let dateNow = moment().format('YYYY-MM-DD'),
        hourNow = moment().format('HH:mm');
    // Obtenemos las asistencias del sitio
    const assistanceSite = await Assistance.find({ site: site._id })
        .populate('logger')
        .populate('assistant')
        .populate('site');
    // Arrays para almacenar las asistencias
    let next = [],
        inCourse = [],
        past = [];
    // Iteramos sobre las asistencias, para filtrarlas por fecha y hora, y devolverlas
    for (const assistance of assistanceSite) {
        let element = {
            id: assistance._id,
            logger: assistance.logger.username,
            assistant: `${assistance.assistant?.name} ${assistance.assistant?.lastname}`,
            site: assistance.site.name,
            date: assistance.date,
            startTime: assistance.startTime,
            endTime: assistance.endTime,
            area: assistance.area,
            status: assistance.status,
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
    // Devolvemos las asistencias
    res.status(200).json({
        msg: 'Asistencias obtenidas',
        next,
        inCourse,
        past,
    });
};

//* Función para obtener las asistencias externas de un sitio
const getAssistancesExternsPerSite = async (req, res) => {
    let dateNow = moment().format('YYYY-MM-DD'),
        hourNow = moment().format('HH:mm');
    // Obtenemos las asistencias del sitio
    const assistanceSite = await AssistanceExternal.find({
        site: req.body.site,
    })
        .populate('logger')
        .populate('assistant')
        .populate('site');

    // Devolvemos las asistencias
    let next = [],
        inCourse = [],
        past = [];

    for (const assistance of assistanceSite) {
        let element = {
            id: assistance._id,
            logger: assistance.logger.username,
            assistant: assistance.assistant.name,
            site: assistance.site.name,
            date: assistance.date,
            startTime: assistance.startTime,
            endTime: assistance.endTime,
            area: assistance.area,
            status: assistance.status,
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

    res.status(200).json({
        msg: 'Asistencias obtenidas',
        next,
        inCourse,
        past,
    });
};
//* Actualizar asistencia interna
const updateAssistanceIntern = async (req, res) => {
    // Obtenemos la asistencia
    const assistance = await Assistance.findById(req.body.id);
    // Si no existe la asistencia
    if (!assistance)
        return res.status(400).json({ msg: 'Asistencia no encontrada' });
    // Verificamos que no sea en domingo
    if (moment(req.body.date).day() === 0)
        return res
            .status(400)
            .json({ msg: 'No se puede crear una asistencia en domingo' });
    // Verificamos que si se registra para el mismo día, la hora de inicio sea mayor a la hora actual por lo menos 15 minutos
    if (
        moment(req.body.date).format('YYYY-MM-DD') ===
            moment().format('YYYY-MM-DD') &&
        moment(req.body.startTime).format('HH:mm') <
            moment().add(15, 'minutes').format('HH:mm')
    )
        return res.status(400).json({
            msg:
                'La hora de inicio debe ser mayor a la hora actual por lo menos 15 minutos',
        });
    // Verificamos que si se registra para el mismo día, la hora de inicio sea menor a la hora de fin
    if (
        moment(req.body.date).format('YYYY-MM-DD') ===
            moment().format('YYYY-MM-DD') &&
        moment(req.body.startTime).format('HH:mm') >=
            moment(req.body.endTime).format('HH:mm')
    )
        return res.status(400).json({
            msg: 'La hora de inicio debe ser menor a la hora de fin',
        });
    // Verificamos que si la asistencia es en el mismo día, la hora de inicio sea mayor a la hora actual
    if (
        req.body.date === moment().format('YYYY-MM-DD') &&
        req.body.startTime < moment().format('HH:mm')
    )
        return res
            .status(400)
            .json({
                msg: 'La hora de inicio de la asistencia no puede ser menor a la hora actual',
            });
    // Verificamos que la asistencia no se solape con otra asistencia
    const assistanceOverlap = await Assistance.find({
        assistant: req.body.assistant,
        site:      req.body.site || assistance.site,
        date:      req.body.date || assistance.date,
        startTime: { 
            $gte: req.body.startTime || assistance.startTime, 
            $lt: req.body.endTime || assistance.endTime
        },
        endTime:   { 
            $gt: req.body.startTime || assistance.startTime,
            $lte: req.body.endTime || assistance.endTime 
        },
        status:  req.body.status || assistance.status,
    });
    // Si existe una asistencia que se solape
    if (assistanceOverlap.length > 0 && req.body.area !== 'IT' )
        return res
            .status(400)
            .json({ msg: 'La asistencia se solapa con otra asistencia' });
    // Verificamos que la hora de entrada no sea menor a las 7:00 y no mayor a las 18:00
    if ( moment(req.body.startTime, 'HH:mm').isBefore(moment('07:00', 'HH:mm')) || moment(req.body.startTime, 'HH:mm').isAfter(moment('18:00', 'HH:mm')) )
            return res.status(400).json({
                msg: 'La hora de entrada no puede ser menor a las 07:00',
            });
    // Verificamos que si es en sábado, la asistencia sea en el horario de 8:30 a 14:00
    if (
        moment(req.body.date).day() === 6 &&
        (req.body.startTime < '08:30' || req.body.endTime > '14:00')
    )
        return res
            .status(400)
            .json({
                msg: 'La asistencia debe ser en el horario de 8:30 a 14:00',
            });
    // Actualizamos la asistencia
    const assistanceUpdated = await Assistance.findByIdAndUpdate(
        req.body.id,
        {
            site: req.body.site || assistance.site,
            date: req.body.date || assistance.date,
            startTime: req.body.startTime || assistance.startTime,
            endTime: req.body.endTime || assistance.endTime,
            area: req.body.area || assistance.area,
        },
        { new: true }
    );
    // Devolvemos la asistencia actualizada
    res.status(200).json({
        msg: 'Asistencia actualizada',
        assistance: assistanceUpdated,
    });
};
//* Actualizar asistencia externa
const updateAssistanceExtern = async (req, res) => {
    // Obtenemos la asistencia
    const assistance = await AssistanceExternal.findById(req.body.id);
    // Si no existe la asistencia
    if (!assistance)
        return res.status(400).json({ msg: 'Asistencia no encontrada' });
    // Verificamos que no sea en domingo
    if (moment(req.body.date).day() === 0)
        return res
            .status(400)
            .json({ msg: 'No se puede crear una asistencia en domingo' });
    // Verificamos que si se registra para el mismo día, la hora de inicio sea mayor a la hora actual por lo menos 15 minutos
    if (
        moment(req.body.date).format('YYYY-MM-DD') ===
            moment().format('YYYY-MM-DD') &&
        moment(req.body.startTime).format('HH:mm') <
            moment().add(15, 'minutos').format('HH:mm')
    )
        return res.status(400).json({
            msg:
                'La hora de inicio debe ser mayor a la hora actual por lo menos 15 minutos',
        });
    // Verificamos que si se registra para el mismo día, la hora de inicio sea menor a la hora de fin
    if (
        moment(req.body.date).format('YYYY-MM-DD') ===
            moment().format('YYYY-MM-DD') &&
        moment(req.body.startTime).format('HH:mm') >=
            moment(req.body.endTime).format('HH:mm')
    )
        return res.status(400).json({
            msg: 'La hora de inicio debe ser menor a la hora de fin',
        });
    // Verificamos que si la asistencia es en el mismo día, la hora de inicio sea mayor a la hora actual
    if (
        req.body.date === moment().format('YYYY-MM-DD') &&
        req.body.startTime < moment().format('HH:mm')
    )
        return res
            .status(400)
            .json({
                msg: 'La hora de inicio de la asistencia no puede ser menor a la hora actual',
            });
    // Verificamos que la asistencia no se solape con otra asistencia
    const assistanceOverlap = await AssistanceExternal.find({
        site: req.body.site,
        date: req.body.date,
        startTime: { $gte: req.body.startTime, $lt: req.body.endTime },
        endTime: { $gt: req.body.startTime, $lte: req.body.endTime },
    });
    // Si existe una asistencia que se solape
    if (assistanceOverlap.length > 0)
        return res
            .status(400)
            .json({ msg: 'La asistencia se solapa con otra asistencia' });
    // Verificamos que la hora de entrada no sea menor a las 7:00 y no mayor a las 18:00
    if ( moment(req.body.startTime, 'HH:mm').isBefore(moment('07:00', 'HH:mm')) || moment(req.body.startTime, 'HH:mm').isAfter(moment('18:00', 'HH:mm')) )
        return res.status(400).json({
            msg: 'La hora de entrada no puede ser menor a las 07:00',
        });
    // Verificamos que si es en sábado, la asistencia sea en el horario de 8:30 a 14:00
    if (
        moment(req.body.date).day() === 6 &&
        (req.body.startTime < '08:30' || req.body.endTime > '14:00')
    )
        return res
            .status(400)
            .json({
                msg: 'La asistencia debe ser en el horario de 8:30 a 14:00',
            });
    // Actualizamos la asistencia
    const assistanceUpdated = await AssistanceExternal.findByIdAndUpdate(
        req.body.id,
        {
            site:      req.body.site || assistance.site,
            date:      req.body.date || assistance.date,
            startTime: req.body.startTime || assistance.startTime,
            endTime:   req.body.endTime || assistance.endTime,
            area:      req.body.area || assistance.area,
            status:    req.body.status || assistance.status,
        },
        { new: true }
    );
    // Devolvemos la asistencia actualizada
    res.status(200).json({
        msg: 'Asistencia actualizada',
        assistance: assistanceUpdated,
    });
};
//* Actualizar status de asistencia interna
const updateStatusAssistanceIntern = async (req, res) => {
    // Obtenemos la asistencia
    const assistance = await Assistance.findById(req.body.id);
    // Si no existe la asistencia
    if (!assistance) return res.status(400).json({ msg: 'Asistencia no encontrada' });
    // Actualizar estado de asistencia
    const assistanceUpdated = await Assistance.findByIdAndUpdate(
        req.body.id,
        {
            status: req.body.status || assistance.status,
        },
        { new: true }
    );
    // Devolvemos la asistencia actualizada
    res.status(200).json({
        msg: 'Asistencia actualizada',
        assistance: assistanceUpdated,
    });
}
//* Actualizar status de asistencia externa
const updateStatusAssistanceExtern = async (req, res) => {
    // Obtenemos la asistencia
    const assistance = await AssistanceExternal.findById(req.body.id);
    // Si no existe la asistencia
    if (!assistance) return res.status(400).json({ msg: 'Asistencia no encontrada' });
    // Actualizar estado de asistencia
    const assistanceUpdated = await AssistanceExternal.findByIdAndUpdate(
        req.body.id,
        {
            status: req.body.status || assistance.status,
        },
        { new: true }
    );
    // Devolvemos la asistencia actualizada
    res.status(200).json({
        msg: 'Asistencia actualizada',
        assistance: assistanceUpdated,
    });
}
//? Exportamos la función para poder usarla en otras partes del código
module.exports = {
    registerAssistance,
    registerAssistanceExternal,
    deleteAssistance,
    deleteAssistanceExternal,
    getAllAssistancesInterns,
    getAllAssistancesExternals,
    getAssistancesPerUser,
    getThirdPartyAssistancePerUser,
    getExternalAssistancePerUser,
    getAssistancesInternsPerSite,
    getAssistancesExternsPerSite,
    updateAssistanceIntern,
    updateAssistanceExtern,
    updateStatusAssistanceIntern,
    updateStatusAssistanceExtern,
};