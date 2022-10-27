import { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import FormAddUser from "./FormAddUser";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "5px",
    p: 2,
};

const AddUserModal = ({ handleAddUser }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 2,
                }}
            >
                <Button
                    variant='outlined'
                    color='primary'
                    sx={{
                        textTransform: "none",
                    }}
                    onClick={handleOpen}
                >
                    Registrar usuario
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
                        Alta de usuario
                    </Typography>
                    <FormAddUser
                        handleClose={handleClose}
                        handleAddUser={handleAddUser}
                        type='add'
                        data={{}}
                    />
                </Box>
            </Modal>
        </>
    );
};

export default AddUserModal;
