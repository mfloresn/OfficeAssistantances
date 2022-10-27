import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import { useResetPassword } from "../hooks/useResetPassword";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "5px",
    p: 2,
};

export const ForgotPasswordModal = () => {
    const [open, setOpen] = useState(false),
        [email, setEmail] = useState(""),
        [code, setCode] = useState(""),
        [password, setPassword] = useState(""),
        [sendEmail, setSendEmail] = useState(false),
        [verifyCode, setVerifyCode] = useState(false);

    const { sendMail, verifyCodeSend, onResetPassword } = useResetPassword(
        email,
        code,
        password
    );

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSendEmail(false);
        setVerifyCode(false);
    };
    const handleChangeMail = (e) => setEmail(e.target.value);
    const handleChangeCode = (e) => setCode(e.target.value);
    const handleChangePassword = (e) => setPassword(e.target.value);
    const handleSendCode = () => {
        sendMail(email)
            .then((resp) => {
                if (resp.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Código enviado",
                        text: "Se ha enviado un código a tu correo",
                    });
                    setSendEmail(true);
                }
            })
            .catch((err) => {
                console.log(err.response);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.response.data.msg,
                });
            });
    };
    const handleVerifyCode = () => {
        verifyCodeSend(email, code)
            .then((resp) => {
                if (resp.status === 200) {
                    setVerifyCode(true);
                }
            })
            .catch((err) => {
                console.log(err);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "El código es incorrecto",
                });
            });
    };
    const handleResetPassword = () => {
        onResetPassword(email, code, password)
            .then((resp) => {
                if (resp.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Contraseña cambiada",
                    });
                    handleClose();
                    setEmail("");
                    setCode("");
                    setPassword("");
                    setSendEmail(false);
                    setVerifyCode(false);
                }
            })
            .catch((err) => {
                console.log(err);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Algo salió mal",
                });
            });
    };

    return (
        <>
            <Button
                variant='text'
                color='warning'
                sx={{
                    marginTop: "3rem",
                    textTransform: "none",
                }}
                onClick={handleOpen}
            >
                ¿Olvidaste tu contraseña?
            </Button>
            <Modal open={open} onClose={handleClose} sx={{ zIndex: 1 }}>
                <Box
                    sx={{
                        ...style,
                        width: "50%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%",
                        }}
                    >
                        <Button
                            variant='text'
                            color='warning'
                            sx={{
                                textTransform: "none",
                            }}
                            onClick={handleClose}
                        >
                            Cerrar
                        </Button>
                    </Box>
                    <Typography
                        variant='h6'
                        component='h2'
                        mb={2}
                        sx={{ color: "rgb(0, 0, 0)" }}
                        textAlign='center'
                    >
                        Recuperación de contraseña
                    </Typography>
                    <Typography
                        variant='body1'
                        component='p'
                        mb={2}
                        sx={{ color: "rgb(0, 0, 0)" }}
                        textAlign='center'
                    >
                        Ingresa tu correo para recibir un código de verificación
                    </Typography>
                    <TextField
                        required
                        name='email'
                        label='Correo'
                        type='email'
                        id='email'
                        variant='outlined'
                        size='small'
                        color='primary'
                        sx={{
                            width: "50%",
                        }}
                        onChange={handleChangeMail}
                    />
                    <Button
                        variant='outlined'
                        color='primary'
                        sx={{
                            textTransform: "none",
                            marginTop: "1rem",
                        }}
                        onClick={handleSendCode}
                    >
                        Enviar
                    </Button>
                    <Typography
                        variant='body1'
                        component='p'
                        mt={4}
                        mb={2}
                        sx={{ color: "rgb(0, 0, 0)" }}
                        textAlign='center'
                    >
                        Ingresa el código de verificación
                    </Typography>
                    <TextField
                        required
                        name='code'
                        label='Código'
                        type='text'
                        id='code'
                        variant='outlined'
                        size='small'
                        color='primary'
                        sx={{
                            width: "30%",
                        }}
                        disabled={!sendEmail}
                        focused={sendEmail}
                        onChange={handleChangeCode}
                    />
                    <Button
                        variant='outlined'
                        color='primary'
                        sx={{
                            textTransform: "none",
                            marginTop: "1rem",
                        }}
                        disabled={!sendEmail}
                        focused={sendEmail}
                        onClick={handleVerifyCode}
                    >
                        Verificar
                    </Button>
                    {verifyCode && (
                        <>
                            <Typography
                                variant='body1'
                                component='p'
                                mt={4}
                                mb={2}
                                sx={{ color: "rgb(0, 0, 0)" }}
                                textAlign='center'
                            >
                                Ingresa tu nueva contraseña
                            </Typography>
                            <TextField
                                required
                                name='password'
                                label='Contraseña'
                                type='password'
                                id='password'
                                variant='outlined'
                                size='small'
                                color='primary'
                                sx={{
                                    width: "50%",
                                }}
                                onChange={handleChangePassword}
                            />
                            <Button
                                variant='outlined'
                                color='primary'
                                sx={{
                                    textTransform: "none",
                                    marginTop: "1rem",
                                }}
                                onClick={handleResetPassword}
                            >
                                Cambiar contraseña
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
};
