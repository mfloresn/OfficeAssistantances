// Importamos librerias
const bcrypt = require("bcryptjs"),
    Joi = require("@hapi/joi");
const { sendMail } = require("../helpers/sendMail");
const { templatePassword } = require("../helpers/template-password-updated");
const verifyToken = require("../helpers/validateToken");
const CodePassword = require("../models/CodePassword");

// Importamos modulos
const User = require("../models/User"),
    { generateJWT } = require("../helpers/generate-jwt");

// Schema para validar el body de registro
const schemaRegister = Joi.object({
    mail: Joi.string().email().required(),
    name: Joi.string().required(),
    lastname: Joi.string().required(),
    password: Joi.string().required(),
    site: Joi.string().required(),
    role: Joi.string().required(),
    area: Joi.string().required(),
});

// Ruta para registrar un usuario
const postUser = async (req, res) => {
    try {
        // Validamos el body que nos manda el cliente, con el schema
        const { error } = schemaRegister.validate(req.body);
        // Si hay error, retornamos el error
        if (error)
            return res.status(400).json({ error: error.details[0].message });

        // Buscamos si el usuario ya existe
        const existMail = await User.findOne({ mail: req.body.mail });
        // Si existe, retornamos error
        if (existMail)
            return res
                .status(400)
                .json({ error: "El correo ya ha sido utilizado" });

        // Hash password, en numberHash ponemos le número de iteraciones que queremos que haga el hash
        // Si no ponemos nada, el hash se hace con un número de iteraciones por defecto
        // Si ponemos un número de iteraciones mayor a 10, el hash se hace más rápido
        // Y en password, hacemos la encriptación del password con la función hashSync a la cual
        // le pasamos el password y el número de iteraciones
        const numberHash = bcrypt.genSaltSync(10),
            password = bcrypt.hashSync(req.body.password, numberHash);

        // Creamos el usuario utilizando el modelo User y le pasamos los datos del body
        const user = new User({
            mail: req.body.mail,
            name: req.body.name,
            lastname: req.body.lastname,
            password: password,
            username: req.body.mail.split("@")[0],
            site: req.body.site,
            role: req.body.role,
            area: req.body.area,
        });

        // Guardar usuario
        await user.save();

        // Devolvemos el usuario
        res.status(200).json({
            msg: "Usuario creado",
            user: user,
        });
    } catch (error) {
        // Si hay error, retornamos el error
        res.status(400).json(error);
    }
};

// Creamos el schema para validar el body de login
const schemaLogin = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

// Función para verificar el password
const getUser = async (req = request, res = response) => {
    // Validar body con el schema
    const { error } = schemaLogin.validate(req.body);
    // Si hay error, retornamos el error
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Buscar usuario
    const user = await User.findOne({ username: req.body.username }).populate(
        "site"
    );
    // Si no existe, retornamos error
    if (!user) return res.status(400).json({ error: "El usuario no existe" });

    // Comparar password, con la función compareSync a la cual le pasamos el password
    // que nos manda el cliente y el password que tenemos en la base de datos
    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );
    // Si no son iguales, retornamos error
    if (!validPassword)
        return res.status(400).json({ error: "Contraseña incorrecta" });

    // Crear token, con la función generateJWT a la cual le pasamos el username del usuario
    const token = await generateJWT(user.username);

    // Devolvemos el token y el usuario
    res.json({
        user: {
            id: user._id,
            username: user.username,
            name: user.name,
            lastname: user.lastname,
            site: user.site.name,
            role: user.role,
            area: user.area,
        },
        token: token,
    });
};

const getAllUsers = async (req = request, res = response) => {
    try {
        // Buscamos todos los usuarios
        const users = await User.find().populate("site");
        for (const user of users) {
            user.password = ":)";
        }
        // Ordenamos los usuarios por nombre
        users.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        });
        // Devolvemos los usuarios
        res.status(200).json({
            msg: "Usuarios",
            users: users,
        });
    } catch (error) {
        // Si hay error, retornamos el error
        res.status(400).json(error);
    }
};

// Función para verificar un usuario
const verifyUser = async (req = request, res = response) => {
    // Buscar usuario
    const user = await User.findOne({ username: req.body.username }).populate(
        "site"
    );
    // Si no existe, retornamos error
    if (!user) return res.status(400).json({ error: "El usuario no existe" });

    // Devolvemos el usuario
    res.status(200).json({
        msg: "Usuario verificado",
        user: {
            id: user._id,
            username: user.username,
            name: `${user.name} ${user.lastname}`,
            site: user.site,
            role: user.role,
            area: user.area,
        },
    });
};

// Cambiar contraseña
const changePassword = async (req = request, res = response) => {
    // Buscamos el usuario
    const user = await User.findById(req.body.id);
    // Si no existe, retornamos error
    if (!user) return res.status(400).json({ error: "El usuario no existe" });
    // Validamos que la contraseña actual sea correcta
    const validPassword = await bcrypt.compare(
        req.body.oldPassword,
        user.password
    );
    // Si no son iguales, retornamos error
    if (!validPassword)
        return res.status(400).json({ error: "Contraseña actual incorrecta" });
    // Validar token
    const validToken = verifyToken(req.body.token);
    // Si no es válido, retornamos error
    if (!validToken)
        return res
            .status(400)
            .json({ error: "Acceso dengado, no cuentas con los permisos." });

    // Hash password, en numberHash ponemos le número de iteraciones que queremos que haga el hash
    // Si no ponemos nada, el hash se hace con un número de iteraciones por defecto
    // Si ponemos un número de iteraciones mayor a 10, el hash se hace más rápido
    // Y en password, hacemos la encriptación del password con la función hashSync a la cual
    // le pasamos el password y el número de iteraciones
    const numberHash = bcrypt.genSaltSync(10),
        password = bcrypt.hashSync(req.body.newPassword, numberHash);

    // Actualizamos el password
    user.password = password;

    // Guardamos el usuario
    await user.save();

    // Devolvemos el usuario
    res.status(200).json({
        msg: "Contraseña cambiada",
        user: user,
    });
};

const deleteUser = async (req = request, res = response) => {
    // Buscamos el usuario
    const user = await User.findById(req.body.id);
    // Si no existe, retornamos error
    if (!user) return res.status(400).json({ error: "El usuario no existe" });
    // Validar token
    const validToken = verifyToken(req.body.token);
    // Si no es válido, retornamos error
    if (!validToken)
        return res
            .status(400)
            .json({ error: "Acceso dengado, no cuentas con los permisos." });
    // Validamos que el usuario que se quiere eliminar no sea el mismo
    if (user.username === req.body.username)
        return res
            .status(400)
            .json({ error: "No puedes eliminarte a ti mismo." });
    // Eliminamos el usuario
    await User.findByIdAndDelete(req.body.id);
    // Devolvemos el usuario
    res.status(200).json({
        msg: "Usuario eliminado",
        user: user,
    });
};

const updateUser = async (req = request, res = response) => {
    const id = req.body.id;
    const { mail, name, lastname, site, role, area } = req.body;
    const username = req.body.mail.split("@")[0];
    const newData = {
        mail,
        name,
        lastname,
        username,
        site,
        role,
        area,
    };
    // Buscamos el usuario
    const user = await User.findById(id);
    // Si no existe, retornamos error
    if (!user) return res.status(400).json({ error: "El usuario no existe" });

    // Buscamos el usuario y lo actualizamos
    const userUpdated = await User.findByIdAndUpdate(
        req.body.id,
        {
            mail:     newData.mail || user.mail,
            name:     newData.name || user.name,
            lastname: newData.lastname || user.lastname,
            username: newData.username || user.username,
            site:     newData.site || user.site,
            role:     newData.role || user.role,
            area:     newData.area || user.area,
        },
        {
            new: true,
        }
    ).populate("site");
    // Si no existe, retornamos error
    if (!user) return res.status(400).json({ error: "El usuario no existe" });
    // Validar token
    const validToken = verifyToken(req.body.token);
    // Si no es válido, retornamos error
    if (!validToken)
        return res
            .status(400)
            .json({ error: "Acceso dengado, no cuentas con los permisos." });
    // Devolvemos el usuario
    res.status(200).json({
        msg: "Usuario actualizado",
        user: {
            id: userUpdated._id,
            mail: userUpdated.mail,
            name: userUpdated.name,
            lastname: userUpdated.lastname,
            username: userUpdated.username,
            site: userUpdated.site,
            role: userUpdated.role,
            area: userUpdated.area,
        },
    });
};

const resetPassword = async (req = request, res = response) => {
    // Buscamos el usuario
    const user = await User.findOne({ mail: req.body.mail });
    // Si no existe, retornamos error
    if (!user) return res.status(400).json({ error: "El usuario no existe" });
    // Buscamos el código
    const code = await CodePassword.findOne({
        user: user._id,
        code: req.body.code,
        status: "verified",
    });
    // Si no existe, retornamos error
    if (!code) return res.status(400).json({ error: "El código no existe" });
    // Actualizamos el código
    code.status = "used";
    // Guardamos el código
    await code.save();
    // Actualizamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    user.password = password;
    // Guardamos el usuario
    await user.save();
    // Generamos el template del correo
    const template = templatePassword();
    // Enviamos el correo
    sendMail(user.mail, "Contraseña actualizada", template);
    // Devolvemos el usuario
    res.status(200).json({
        msg: "Contraseña actualizada",
        user: user,
    });
};

// Exportamos las rutas
module.exports = {
    postUser,
    getUser,
    getAllUsers,
    verifyUser,
    changePassword,
    deleteUser,
    updateUser,
    resetPassword,
};
