// Importamos los elementos necesarios de mongoose
const { Schema, model, Types } = require( 'mongoose' );


// Creamos el schema para registrar una asistencia, para crear los elementos de la base de datos
const AssistanceSchema = Schema( 
    {
        logger: {
            type: Types.ObjectId,
            required: true,
            ref: 'User',
        },
        assistant: {
            type: Types.ObjectId,
            required: true,
            ref: 'User',
        },
        site: {
            type: Types.ObjectId,
            required: true,
            ref: 'Site',
        },
        date: {
            type: String,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        area: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'Pendiente',
        },
    }, 
    {
        timestamps: true,
    }
);

module.exports = model( 'Assistance', AssistanceSchema);