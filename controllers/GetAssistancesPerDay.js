const moment = require("moment");
const { sendMail } = require("../helpers/sendMail");
const templateSendAssistances = require("../helpers/template-send-assistances");

const Assistance = require("../models/Assistance"),
    External = require("../models/External"),
    User = require("../models/User");

const getAssistancesPerDay = async (req, res) => {
    const date = moment().format("YYYY-MM-DD");
    const users = await User.find({ role: "manager" });
    let data = [],
        auxData = {},
        to = [],
        assistances = [],
        external = [],
        allAsistances = [];
    for (const user of users) {
        to.push(user.mail);
        assistances = await Assistance.find({
            user: user._id,
            site: user.site._id,
            date: date,
        })
            .populate("assistant")
            .populate("logger")
            .populate("site");
        external = await External.find({
            user: user._id,
            site: user.site._id,
            date: date,
        })
            .populate("logger")
            .populate("site");
        allAsistances = [...assistances, ...external];
        auxData = {
            user: user.username,
            mail: user.mail,
            assistances: allAsistances,
        };
        data.push(auxData);
        auxData = {};
    }
    const template = templateSendAssistances(allAsistances);
    sendMail(to, "Asistencias del día", template);
    console.log("Asistencias enviadas");
};

module.exports = getAssistancesPerDay;
