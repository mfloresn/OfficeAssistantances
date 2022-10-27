import axios from "axios";
import Swal from "sweetalert2";
import url from "./URL";

const editAssistanceExtern = async (values) => {
    const { id, logger, site, date, startTime, endTime, area } = values;
    const data = JSON.stringify({
            logger: logger,
            id: id,
            site: site,
            date: date,
            startTime: startTime,
            endTime: endTime,
            area: area,
        }),
        config = {
            method: "put",
            url: `/api/assistance/updateexternal`,
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        };

    const response = await axios(config);
    return {
        status: response.status,
        data: response.data,
    };
};

export default editAssistanceExtern;
