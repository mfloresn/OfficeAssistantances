import React, { useState } from "react";
import { Divider, Typography, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import DrawerBar from "../components/Drawer";
import NavBar from "../components/NavBar";
import ShowTablesDash from "../components/ShowInfoUser";

const drawerWidth = 250;

const Navbar = styled(NavBar, { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: drawerWidth,
        }),
    })
);

const Dashboard = () => {
    const [section, setSection] = useState(false),
        [info, setInfo] = useState(false),
        [open, setOpen] = useState(false);

    const handleSection = (data) => setSection(data);
    const handleInfo = (data) => setInfo(data);
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    return (
        <>
            <Navbar event={handleDrawerOpen} open={open} />
            <main
                style={{
                    marginTop: "6rem",
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                <Typography variant='h5' component='h1'>
                    {section === false
                        ? `Mis Asistencias`
                        : section}
                </Typography>
                <Divider
                    sx={{
                        mt: 2,
                        "&::before, &::after": {
                            borderColor: "rgb(0, 0, 0)",
                        },
                    }}
                    variant='string'
                >
                    <Chip
                        label={info === false ? "Nueva asistencia" : info}
                        sx={{
                            fontSize: "1.2rem",
                            borderRadius: "5px",
                            borderColor: "rgb(0, 0, 0)",
                        }}
                        variant='outlined'
                    />
                </Divider>
                <ShowTablesDash section={section} info={info} />
            </main>
            <DrawerBar
                handleSection={handleSection}
                handleInfo={handleInfo}
                open={open}
                eventOpen={handleDrawerOpen}
                eventClose={handleDrawerClose}
            />
        </>
    );
};

export default Dashboard;
