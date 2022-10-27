// Importamos los elementos necesarios de mongoose
const { Schema, model } = require( 'mongoose' );

// Shchema para sitio
const SiteSchema = Schema( {
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    abbreviation: {
        type: String,
        required: true,
    }
} );

// Exportamos el modelo de sitio
module.exports = model( 'Site', SiteSchema );