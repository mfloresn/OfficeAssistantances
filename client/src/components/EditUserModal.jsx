import { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import FormEditUser from "./FormEditUser";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "5px",
    p: 2,
};

const EditUserModal = ({ user, handleEditUser }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <Button
                    variant='outlined'
                    color='primary'
                    size='small'
                    sx={{
                        marginBottom: "1rem",
                        marginTop: "1rem",
                        textTransform: "none",
                        width: "60px",
                        marginLeft: "0.5rem",
                    }}
                    onClick={handleOpen}
                >
                    Editar
                </Button>
            </Box>
            <Modal open={open} onClose={handleClose} sx={{ zIndex: 1 }}>
                <Box
                    sx={{
                        ...style,
                        width: "70%",
                    }}
                >
                    <Typography
                        variant='h6'
                        component='h2'
                        mb={2}
                        sx={{ color: "rgb(0, 0, 0)" }}
                    >
                        Editar usuario
                    </Typography>
                    <FormEditUser
                        handleEditUser={handleEditUser}
                        handleClose={handleClose}
                        data={user}
                    />
                </Box>
            </Modal>
        </>
    );
};

export default EditUserModal;
