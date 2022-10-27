import axios from "axios";
import url from "./URL";

const resetPassword = async (email, code, password) => {
    const body = {
        mail: email,
        code: code,
        password: password,
    };
    const config = {
        method: 'put',
        url: `/api/user/resetpassword`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data: body
    };
    
    return await axios( config );
}

export default resetPassword;