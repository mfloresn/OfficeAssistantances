const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(norcul.com)$/,
    nameRegex = /^[A-Za-záéíóúüñÁÉÍÓÚÑ ]{3,30}$/,
    passwordRegex = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{5,16}$/;

const validateMail = (mail) => mailRegex.test(String(mail).toLowerCase());

const validateName = (name) => nameRegex.test(String(name).toLowerCase());

const validatePassword = (password) => passwordRegex.test(String(password).toLowerCase());

export { validateMail, validateName, validatePassword };