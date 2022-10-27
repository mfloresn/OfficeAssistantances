import * as React from "react";
import {
    Avatar,
    Typography,
    ListItemButton,
    Collapse,
    List,
    Box,
    Paper,
    Button,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import EditUserModal from "./EditUserModal";

const CardUser = ({ user, handDeleteUser, handleEditUser }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(!open);
    return (
        <List
            sx={{
                margin: "0.5rem",
            }}
        >
            <Paper elevation={3} sx={{ width: "300px" }}>
                <ListItemButton
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        textAlign: "left",
                    }}
                    onClick={handleOpen}
                >
                    <Avatar
                        sx={{
                            marginRight: 1,
                            bgcolor: "rgb(0, 102, 71)",
                            display: "flex",
                            width: "15%",
                            height: "40px",
                        }}
                    >
                        {user.name.charAt(0) + user.lastname.charAt(0)}
                    </Avatar>
                    <Typography
                        sx={{
                            mr: 1,
                            width: "75%",
                        }}
                    >
                        {user.name} {user.lastname}
                    </Typography>
                    {open ? (
                        <ExpandLess
                            sx={{ color: "rgb(0, 102, 71)", width: "10%" }}
                        />
                    ) : (
                        <ExpandMore
                            sx={{ color: "rgb(0, 102, 71)", width: "10%" }}
                        />
                    )}
                </ListItemButton>
                <Collapse in={open} timeout='auto' unmountOnExit>
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            marginLeft: "8%",
                            textAlign: "left",
                        }}
                    >
                        <Typography
                            variant='body2'
                            component='div'
                            sx={{ width: "20%" }}
                        >
                            User:
                        </Typography>
                        <Typography variant='body2' component='div'>
                            <b>{user.username}</b>
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            marginLeft: "8%",
                            textAlign: "left",
                        }}
                    >
                        <Typography
                            variant='body2'
                            component='div'
                            sx={{ width: "20%" }}
                        >
                            Correo:
                        </Typography>
                        <Typography variant='body2' component='div'>
                            <b>{user.mail}</b>
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            marginLeft: "8%",
                            textAlign: "left",
                        }}
                    >
                        <Typography
                            variant='body2'
                            component='div'
                            sx={{ width: "20%" }}
                        >
                            Sitio:
                        </Typography>
                        <Typography variant='body2' component='div'>
                            <b>{user.site.name}</b>
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            marginLeft: "8%",
                            textAlign: "left",
                        }}
                    >
                        <Typography
                            variant='body2'
                            component='div'
                            sx={{ width: "20%" }}
                        >
                            Área:
                        </Typography>
                        <Typography variant='body2' component='div'>
                            <b>{user.area}</b>
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "flex-end",
                            paddingRight: "20px",
                        }}
                    >
                        <Button
                            variant='outlined'
                            color='error'
                            size='small'
                            sx={{
                                marginBottom: "1rem",
                                marginTop: "1rem",
                                textTransform: "none",
                                width: "60px",
                            }}
                            onClick={() => handDeleteUser(user._id)}
                        >
                            Eliminar
                        </Button>
                        <EditUserModal
                            user={user}
                            handleEditUser={handleEditUser}
                        />
                    </Box>
                </Collapse>
            </Paper>
        </List>
    );
};

export default CardUser;
