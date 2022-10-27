// Importamos la librería de jsonwebtoken
const jwt = require( 'jsonwebtoken' );

// La función que verifica el JWT
const verifyToken = ( token ) => {
    // Verificar si el token existe
    if( !token ) return 'No token provided';
    // Verificar el token
    const verified = jwt.verify( token, process.env.TOKEN_SECRET );
    // Continuar con la ejecución
    if( verified ) return 'Token verified';
}

// Exportamos la función verifyToken
module.exports = verifyToken;