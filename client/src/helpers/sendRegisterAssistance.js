import axios from "axios";
import url from "./URL";

const sendRegisterAssistance = async (data) => {
    const { logger, assistant, site, date, entry, exit } = data,
        link = `/api/assistance/register`,
        body = {
            logger,
            assistant,
            site,
            date,
            startTime: entry,
            endTime: exit,
            status: "Pendiente",
        },
        config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
    return await axios.post(link, body, config);
};

export default sendRegisterAssistance;
