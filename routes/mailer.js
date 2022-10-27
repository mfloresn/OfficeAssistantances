const router = require('express').Router();

const {
    forgotPassword,
    verifyCode,
} = require("../controllers/sendMail.js");

router.post("/forgot", forgotPassword);
router.post("/verify", verifyCode);

module.exports = router;