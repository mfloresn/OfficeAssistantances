//* Importamos los modelos
const AssistanceExternal = require('../models/External'),
    User = require('../models/User');

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

module.exports = deleteAssistanceExternal;  