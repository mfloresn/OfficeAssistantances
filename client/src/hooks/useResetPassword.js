import Swal from "sweetalert2";
import resetPassword from "../helpers/resetPassword";
import sendMailForgotPassword from "../helpers/sendMailForgotPassword";
import verifyCodeMail from "../helpers/verifyCodeMail";

export const useResetPassword = ( email, code, password ) => {
    const sendMail = () => {
            const resp = sendMailForgotPassword(email);
            return resp;
    };
    const verifyCodeSend = () => {
        const resp = verifyCodeMail(email, code);
        return resp;
    };
    const onResetPassword = () => {
        const resp = resetPassword(email, code, password);
        return resp;
    };

    return {
        sendMail,
        verifyCodeSend,
        onResetPassword,
    };
};
