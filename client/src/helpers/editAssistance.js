import axios from "axios";
import url from "./URL";

const editAssistance = async (values) => {
    const { 
        id, 
        logger, 
        assistant, 
        site, 
        date, 
        startTime, 
        endTime, 
        area 
    } = values;
    const data = JSON.stringify({
            id:        id,
            logger:    logger,
            assistant: assistant,
            site:      site,
            date:      date,
            startTime: startTime,
            endTime:   endTime,
            area:      area,
        }),
        config = {
            method: "put",
            url: `/api/assistance/update`,
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        };

    const response = await axios(config);
    return {
        status: response.status,
        data: response.data,
    }
};

export default editAssistance;
