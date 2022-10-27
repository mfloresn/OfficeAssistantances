// Importamos la librería de jsonwebtoken
const jwt = require( 'jsonwebtoken' );

// La función que genera el JWT recibe el id del usuario
const generateJWT = ( uid ) => {
    // Retornamos una pormesa con el token
    return new Promise( ( resolve, reject ) => {
        // El payload será el id del usuario
        const payload = { uid };
        // Creamos el token con la función sign de jsonwebtoken, pasándole el payload y el secret
        // si hay error, retornamos el error, si no, retornamos el token
        jwt.sign( 
            payload, 
            process.env.TOKEN_SECRET,
            ( error, token ) => {
                if( error ) {
                    console.log( error );
                    reject( 'No se pudo general el token' );
                } else {
                    resolve( token );
                }
            }
        );
    } );
}

// Exportamos la función generateJWT
module.exports = {
    generateJWT
}