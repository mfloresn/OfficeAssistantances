// Importamos router de express
const router = require('express').Router();

// Importamos el controlador de registro e inicio de sesión
const { 
    postUser, 
    getUser, 
    getAllUsers,
    verifyUser,
    changePassword,
    deleteUser,
    updateUser,
    resetPassword
} = require('../controllers/User');

// Creamos rutas post para registro, inicio de sesión y verificación de usuario
router.post  ( '/register',       postUser       );
router.post  ( '/login',          getUser        );
router.get   ( '/',               getAllUsers    ); 
router.get   ( '/verify',         verifyUser     );
router.put   ( '/changePassword', changePassword );
router.delete( '/delete',         deleteUser     );
router.put   ( '/update',         updateUser     );
router.put   ( '/resetpassword',  resetPassword  );

module.exports = router;