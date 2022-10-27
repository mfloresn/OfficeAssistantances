import axios from "axios";
import url from "./URL";

const deleteAssistance = async (logger, id) => {
    const data = JSON.stringify({
            logger: logger,
            id: id,
        }),
        config = {
            method: "delete",
            url: `/api/assistance/delete`,
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        };
    const resp = await axios(config);
    return resp;
};

export default deleteAssistance;
