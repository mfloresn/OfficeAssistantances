//* Importamos los modelos
const AssistanceExternal = require('../models/External');

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

module.exports = updateStatusAssistanceExtern;