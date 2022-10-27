import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import PasswordRoundedIcon from "@mui/icons-material/PasswordRounded";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { Button, useMediaQuery } from "@mui/material";
import { changePassword } from "../helpers/changePassword";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "5px",
    p: 4,
};

const ChangePasswordModal = () => {
    const matches = useMediaQuery("( min-width: 700px )"),
        [open, setOpen] = React.useState(false),
        [oldPassword, setOldPassword] = React.useState(""),
        [newPassword, setNewPassword] = React.useState(""),
        [confirmPassword, setConfirmPassword] = React.useState(""),
        [alert, setAlert] = React.useState(false),
        [passwordMatch, setPasswordMatch] = React.useState(false),
        [longPassword, setLongPassword] = React.useState(false);

    const handleOldPassword = (event) => setOldPassword(event.target.value);
    const handleNewPassword = (event) => setNewPassword(event.target.value);
    const handleConfirmPassword = (event) =>
        setConfirmPassword(event.target.value);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };
    const handleClick = () => {
        if (oldPassword === "" || newPassword === "" || confirmPassword === "")
            return setAlert(true);
        if (newPassword !== confirmPassword) return setPasswordMatch(true);
        if (newPassword.length < 6) return setLongPassword(true);
        changePassword(oldPassword, newPassword);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        handleClose();
    };

    return (
        <>
            <ListItemButton onClick={handleOpen}>
                <ListItemIcon>
                    <PasswordRoundedIcon
                        sx={{ color: "rgb(0, 102, 71)" }}
                        key='logout'
                    />
                </ListItemIcon>
                <ListItemText primary='Cambiar contraseña' />
            </ListItemButton>
            <Modal open={open} onClose={handleClose} sx={{ zIndex: 1 }}> 
                <Box
                    sx={{
                        ...style,
                        width: matches ? "40%" : "70%",
                    }}
                >
                    <Typography
                        variant='h6'
                        component='h2'
                        mb={3}
                        sx={{ color: "rgb(0, 102, 71)" }}
                    >
                        Cambio de contraseña
                    </Typography>
                    <Typography variant='body1'>Contraseña actual</Typography>
                    <TextField
                        variant='outlined'
                        type='password'
                        size='small'
                        security='true'
                        fullWidth
                        sx={{ mb: 2 }}
                        onChange={handleOldPassword}
                    />
                    <Typography variant='body1'>Nueva contraseña</Typography>
                    <TextField
                        variant='outlined'
                        type='password'
                        size='small'
                        security='true'
                        fullWidth
                        sx={{ mb: 2 }}
                        onChange={handleNewPassword}
                    />
                    <Typography variant='body1'>
                        Confirme nueva contraseña
                    </Typography>
                    <TextField
                        variant='outlined'
                        type='password'
                        size='small'
                        security='true'
                        fullWidth
                        sx={{ mb: 2 }}
                        onChange={handleConfirmPassword}
                    />
                    {alert && (
                        <Alert severity='warning'>
                            Todos los campos son obligatorios
                        </Alert>
                    )}
                    {passwordMatch && (
                        <Alert severity='error'>
                            Las contraseñas no coinciden
                        </Alert>
                    )}
                    {longPassword && (
                        <Alert severity='warning'>
                            La contraseña debe tener al menos 6 caracteres
                        </Alert>
                    )}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginRight: "0.5rem",
                        }}
                    >
                        <Button
                            variant='text'
                            color='error'
                            sx={{
                                mt: 2,
                                textTransform: "none",
                                marginRight: "0.5rem",
                            }}
                            onClick={handleClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant='outlined'
                            color='success'
                            sx={{
                                mt: 2,
                                textTransform: "none",
                            }}
                            onClick={handleClick}
                        >
                            Cambiar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};
export default ChangePasswordModal;
