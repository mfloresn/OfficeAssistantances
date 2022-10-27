// Importamos los elementos necesarios de mongoose
const { Schema, model, Types } = require( 'mongoose' ),
    moment = require( 'moment' );

// Creamos el schema para registrar una asistencia, para crear los elementos de la base de datos
const AssistanceExternalSchema = Schema( 
    {
        logger: {
            type: Types.ObjectId,
            required: true,
            ref: 'User',
        },
        assistant: {
            type: String,
            required: true,
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
        createdModified: {
            type: String,
            default: moment().format( 'YYYY-MM-DD HH:mm' ),
        }
    },
    {
        timestamps: true,
    }
);

module.exports = model( 'AssistanceExternal', AssistanceExternalSchema, );