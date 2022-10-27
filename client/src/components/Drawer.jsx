import React from "react";
import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import ButtonCollapse from "./ButtonCollapse";
import ChangePasswordModal from "./ChangePasswordModal";
import getAssistancesUser from "../helpers/getAssistancesUser";

const drawerWidth = 250;

const DrawerBar = ({ handleSection, handleInfo, open, eventClose }) => {
    const [assistances, setAssistances] = React.useState([]);
    const matches = useMediaQuery("(min-width:600px)");
    const user = sessionStorage.getItem("username");

    const handleClick = (event) => {
        let key = event.currentTarget.textContent;
        switch (key) {
            case "Cambiar contraseña":
                <ChangePasswordModal openModal='true' />;
                break;
            case "Cerrar sesión":
                sessionStorage.clear();
                window.location.reload();
                break;
            default:
                break;
        }
    };

    React.useEffect(() => {
        getAssistancesUser(user).then((response) => {
            setAssistances(response.inCourse);
        });
    }, []);

    const updateSection = (data) => handleSection(data);
    const updateInfo = (data) => handleInfo(data);

    const drawer = (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    p: 1,
                    mr: "10px",
                }}
            >
                <IconButton onClick={eventClose}>
                    <ArrowBackSharpIcon
                        sx={{ color: "rgb(0, 102, 71)", fontSize: "2rem" }}
                    />
                </IconButton>
            </Box>
            <Divider />
            {!matches && (
                <>
                    <Typography
                        variant='h6'
                        component='div'
                        textAlign='center'
                        mt={1}
                        mb={1}
                    >
                        {`Hola, ${
                            sessionStorage.getItem("name").split(" ")[0]
                        } ${sessionStorage.getItem("lastname").split(" ")[0]}`}
                    </Typography>
                    <Divider />
                </>
            )}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    mt: 2,
                    fontSize: "1.5rem",
                }}
            >
                {assistances !== undefined && assistances.length > 0 ? (
                    <Typography
                        variant='body1'
                        component='div'
                        sx={{ flexGrow: 1, mb: 1 }}
                    >
                        Asistencia en curso <br />
                        <Typography
                            variant='body2'
                            component='div'
                            sx={{ flexGrow: 1 }}
                        >
                            {assistances[0].site} - {assistances[0].date}
                        </Typography>
                        <Typography
                            variant='body2'
                            component='div'
                            sx={{ flexGrow: 1 }}
                        >
                            {assistances[0].startTime} -{" "}
                            {assistances[0].endTime}
                        </Typography>
                    </Typography>
                ) : (
                    <Typography
                        variant='body2'
                        component='div'
                        sx={{ flexGrow: 1, mb: 2 }}
                    >
                        No tienes asistencias en curso
                    </Typography>
                )}
            </Box>
            <Divider />
            <List>
                <ButtonCollapse
                    updateSection={updateSection}
                    updateInfo={updateInfo}
                />
                <Divider />
                <ListItem key='Cambiar contraseña' disablePadding>
                    <ChangePasswordModal />
                </ListItem>
                <ListItem key='Cerrar sesión' disablePadding>
                    <ListItemButton onClick={handleClick}>
                        <ListItemIcon>
                            <LogoutRoundedIcon
                                sx={{ color: "rgb(0, 102, 71)" }}
                                key='logout'
                            />
                        </ListItemIcon>
                        <ListItemText primary='Cerrar sesión' />
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    );

    return (
        <>
            <Drawer
                variant='temporary'
                open={open}
                onClose={eventClose}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                    },
                    marginTop: "64px",
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default DrawerBar;
