// Importamos ruoutes de express
const router = require('express').Router();

// Importamos el controlador de asistencia
const registerAssistance           = require( '../controllers/RegisterAssistance'             ),
    deleteAssistance               = require( '../controllers/DeleteAssistance'               ),
    registerAssistanceExternal     = require( '../controllers/RegisterAssistanceExternal'     ),
    deleteAssistanceExternal       = require( '../controllers/DeleteAssistanceExternal'       ),
    getAssistancesInterns          = require( '../controllers/GetAssistancesInterns'          ),
    getAssistancesExterns          = require( '../controllers/GetAssistancesExterns'          ),
    getAssistancesPerUser          = require( '../controllers/GetAssistancesPerUser'          ),
    getAssistancesThirdPerUser     = require( '../controllers/GetAssitancesThirdPerUser'      ),
    getAssistancesExternsPerUser   = require( '../controllers/GetAssistancesExternalPerUser'  ),
    getAssistancesPerSite          = require( '../controllers/GetAssistancesPerSite'          ),
    updateAssistanceIntern         = require( '../controllers/UpdateAssistanceIntern'         ),
    updateAssistanceExternal       = require( '../controllers/UpdateAssistanceExternal'       ),
    updateStatusAssistanceIntern   = require( '../controllers/UpdateStatusAssistanceIntern'   ),
    updateStatusAssistanceExternal = require( '../controllers/UpdateStatusAssistanceExternal' ),
    getAssistancesPerDay           = require( '../controllers/GetAssistancesPerDay'           );

// Creamos rutas para las asistencias
router.get   ( '/',                         getAssistancesInterns          );
router.post  ( '/register',                 registerAssistance             ); 
router.post  ( '/registerexternal',         registerAssistanceExternal     );
router.delete( '/delete',                   deleteAssistance               );
router.delete( '/deleteexternal',           deleteAssistanceExternal       );
router.get   ( '/external',                 getAssistancesExterns          );
router.get   ( '/userassistance/:username', getAssistancesPerUser          );
router.get   ( '/thirdparty/:username',     getAssistancesThirdPerUser     );
router.get   ( '/userexternal/:username',   getAssistancesExternsPerUser   );
router.get   ( '/siteassistance/:site',     getAssistancesPerSite          );
router.put   ( '/update',                   updateAssistanceIntern         );
router.put   ( '/updateexternal',           updateAssistanceExternal       );
router.put   ( '/updatestatus',             updateStatusAssistanceIntern   );
router.put   ( '/updatestatusexternal',     updateStatusAssistanceExternal );
router.get   ( '/day',                      getAssistancesPerDay           );

module.exports = router;