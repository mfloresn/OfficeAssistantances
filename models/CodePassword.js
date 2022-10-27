// Importamos los elementos necesarios de mongoose
const { Schema, model, Types } = require( 'mongoose' );

// Creamos el schema para guardar el usuario y el código de verificación
const CodePasswordSchema = Schema(
    {
        user: {
            type: Types.ObjectId,
            required: true,
            ref: 'User',
        },
        code: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model( 'CodePassword', CodePasswordSchema, );