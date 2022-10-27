import axios from "axios";
import url from "./URL";

const verifyCodeMail = async (email, code) => {
    const body = {
        mail: email,
        code: code,
    };
    const config = {
        method: 'post',
        url: `${ url }/api/mail/verify`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data: body
    };
    
    return await axios( config );
}

export default verifyCodeMail;