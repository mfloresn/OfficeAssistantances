import axios from "axios";
import Swal from "sweetalert2";
import url from "./URL";

const deleteAssistanceExtern = async (logger, id) => {
    const data = JSON.stringify({
            logger: logger,
            id: id,
        }),
        config = {
            method: "delete",
            url: `/api/assistance/deleteexternal`,
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        };
    const resp = await axios(config);
    return resp;
};

export default deleteAssistanceExtern;
