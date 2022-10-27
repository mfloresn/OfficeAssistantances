//* Importamos los modelos
const Assistance = require('../models/Assistance'),
    User = require('../models/User');

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

//* Exportamos la función
module.exports = deleteAssistance;