// Importamos los elementos necesarios de mongoose
const { Schema, model, Types } = require( 'mongoose' );

// Creamos el schema para el usuario, para crear los elementos de la base de datos
const UserSchema = Schema( {
    mail: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    site: {
        type: Types.ObjectId,
        ref: 'Site',
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    }
} );

module.exports =  model( 'User', UserSchema );