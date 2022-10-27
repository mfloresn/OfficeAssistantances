import axios from "axios";
import url from "./URL";

const sendMailForgotPassword = async (email) => {
    const body = {
        mail: email,
    };
    const config = {
        method: 'post',
        url: `/api/mail/forgot`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data: body
    };
    
    return await axios( config );
}

export default sendMailForgotPassword;