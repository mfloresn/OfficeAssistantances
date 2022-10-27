const { generateCode } = require("../helpers/generate-code");
const { generateTemplateSendMail } = require('../helpers/template-send-code');
const { sendMail } = require("../helpers/sendMail");
const CodePassword = require("../models/CodePassword");
const User = require("../models/User");


const forgotPassword = async (req = request, res = response) => {
    // Buscamos el usuario
    const user = await User.findOne({ mail: req.body.mail });
    // Si no existe, retornamos error
    if (!user) return res.status(400).json({ error: "El usuario no existe" });
    // Generamos el código de verificación
    const code = generateCode();
    // Generamos el template del correo
    const template = generateTemplateSendMail(code);
    // Enviamos el correo
    sendMail(user.mail, "Código de verificación", template);
    // Si el correo se envía correctamente, guardamos el código en la base de datos
    const userCode = new CodePassword({
        user: user._id,
        code,
        status: "active",
    });
    // Guardamos el código
    userCode.save();
    // Devolvemos el usuario
    res.status(200).json({
        msg: "Código enviado",
        user: user.mail,
        code: code,
    });
};

const verifyCode = async (req = request, res = response) => {
    // Buscamos el usuario
    const user = await User.findOne({ mail: req.body.mail });
    // Si no existe, retornamos error
    if (!user) return res.status(400).json({ error: "El usuario no existe" });
    // Buscamos el código
    const code = await CodePassword.findOne({
        user: user._id,
        code: req.body.code,
        status: "active",
    });
    // Si no existe, retornamos error
    if (!code) return res.status(400).json({ error: "El código no existe" });
    // Actualizamos el código
    code.status = "verified";
    // Guardamos el código
    await code.save();
    res.status(200).json({
        msg: "Código verificado",
        user: user,
        code: code,
    });
};

module.exports = {
    forgotPassword,
    verifyCode,
};
