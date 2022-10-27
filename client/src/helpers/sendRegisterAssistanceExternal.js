import axios from "axios";
import Swal from "sweetalert2";
import url from "./URL";

const sendRegisterAssistanceExternal = async (data) => {
    const { logger, assistant, site, date, entry, exit, area } = data,
        link = `/api/assistance/registerexternal`,
        body = {
            logger,
            assistant,
            site,
            date,
            startTime: entry,
            endTime: exit,
            area,
            status: "Pendiente",
        },
        config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
    return await axios.post(link, body, config);
};

export default sendRegisterAssistanceExternal;
