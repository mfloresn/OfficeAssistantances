const nodemailer = require("nodemailer");

const sendMail = async( mail, subject, body, copia = '' ) => {
    console.log(copia);
    const config = {
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        auth: {
            user: 'itsupport@norcul.com',
            pass: '22NOR=08succ',
        },
    }

    const transporter = nodemailer.createTransport(config);

    const mailOptions = {
        from: 'itsupport@norcul.com',
        to: mail,
        cc: copia,
        subject: subject,
        html: body,
    };


    const sendMail = await transporter.sendMail(mailOptions)
        .then( info => {
            console.log(info);
            return info;
        })
        .catch( error => {
            console.log(error);
            return error;
        });

    console.log(sendMail);

    return {
        msg: "Correo enviado",
        sendMail,
    };
};

module.exports = {
    sendMail,
};