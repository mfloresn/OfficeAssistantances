import React from "react";
import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Divider,
} from "@mui/material";
import PersonSharp from "@mui/icons-material/PersonSharp";
import PeopleAltSharpIcon from "@mui/icons-material/PeopleAltSharp";
import HailTwoToneIcon from "@mui/icons-material/HailTwoTone";
import ApartmentSharpIcon from "@mui/icons-material/ApartmentSharp";
import ArrowForwardSharpIcon from "@mui/icons-material/ArrowForwardSharp";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import AccessTimeSharpIcon from "@mui/icons-material/AccessTimeSharp";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SupervisedUserCircleSharpIcon from "@mui/icons-material/SupervisedUserCircleSharp";

const ButtonCollapse = ({ updateSection, updateInfo }) => {
    const [openMyAssistances, setOpenMyAssistances] = React.useState(false),
        [openInternAssistances, setOpenInternAssistances] =
            React.useState(false),
        [openExternalAssistances, setOpenExternalAssistances] =
            React.useState(false),
        [openSiteAssistances, setOpenSiteAssistances] = React.useState(false);

    const handleClickMyAssistances = () => {
        setOpenMyAssistances(!openMyAssistances);
        setOpenInternAssistances(false);
        setOpenExternalAssistances(false);
        setOpenSiteAssistances(false);
    };
    const handleClickInternAssistances = () => {
        setOpenInternAssistances(!openInternAssistances);
        setOpenMyAssistances(false);
        setOpenExternalAssistances(false);
        setOpenSiteAssistances(false);
    };
    const handleClickExternalAssistances = () => {
        setOpenExternalAssistances(!openExternalAssistances);
        setOpenMyAssistances(false);
        setOpenInternAssistances(false);
        setOpenSiteAssistances(false);
    };
    const handleClickSiteAssistances = () => {
        setOpenSiteAssistances(!openSiteAssistances);
        setOpenMyAssistances(false);
        setOpenInternAssistances(false);
        setOpenExternalAssistances(false);
    };
    const handleUpdateInfo = (section, info) => {
        updateSection(section);
        updateInfo(info);
    };

    const site = sessionStorage.getItem("site"),
        role = sessionStorage.getItem("role");

    return (
        <>
            {/**/}
            {role === "manager" && (
                <>
                    <ListItemButton onClick={handleClickSiteAssistances}>
                        <ListItemIcon>
                            <ApartmentSharpIcon
                                sx={{ color: "rgb(0, 102, 71)" }}
                                key='internassistances'
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary='Asistencias del sitio'
                            sx={{ color: "rgb(0, 0, 0)" }}
                        />
                        {openMyAssistances ? (
                            <ExpandLess sx={{ color: "rgb(0, 102, 71)" }} />
                        ) : (
                            <ExpandMore sx={{ color: "rgb(0, 102, 71)" }} />
                        )}
                    </ListItemButton>
                    <Collapse
                        in={openSiteAssistances}
                        timeout='auto'
                        unmountOnExit
                    >
                        <List component='div' disablePadding>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                    handleUpdateInfo(
                                        `Asistencias - ${site}`,
                                        `En curso`
                                    )
                                }
                            >
                                <ListItemIcon>
                                    <AccessTimeSharpIcon
                                        sx={{ color: "rgb(0, 102, 71)" }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    secondary='En curso'
                                    sx={{ color: "rgb(0, 0, 0)" }}
                                />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                    handleUpdateInfo(
                                        `Asistencias - ${site}`,
                                        `Próximas`
                                    )
                                }
                            >
                                <ListItemIcon>
                                    <ArrowForwardSharpIcon
                                        sx={{ color: "rgb(0, 102, 71)" }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    secondary='Próximas'
                                    sx={{ color: "rgb(0, 0, 0)" }}
                                />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                    handleUpdateInfo(
                                        `Asistencias - ${site}`,
                                        `Pasadas`
                                    )
                                }
                            >
                                <ListItemIcon>
                                    <ArrowBackSharpIcon
                                        sx={{ color: "rgb(0, 102, 71)" }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    secondary='Pasadas'
                                    sx={{ color: "rgb(0, 0, 0)" }}
                                />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <Divider />
                </>
            )}
            {role === "admin" && (
                <>
                    <ListItemButton onClick={handleClickSiteAssistances}>
                        <ListItemIcon>
                            <ApartmentSharpIcon
                                sx={{ color: "rgb(0, 102, 71)" }}
                                key='assistances'
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary='Asistencias Norcul'
                            sx={{ color: "rgb(0, 0, 0)" }}
                        />
                        {openMyAssistances ? (
                            <ExpandLess sx={{ color: "rgb(0, 102, 71)" }} />
                        ) : (
                            <ExpandMore sx={{ color: "rgb(0, 102, 71)" }} />
                        )}
                    </ListItemButton>
                    <Collapse
                        in={openSiteAssistances}
                        timeout='auto'
                        unmountOnExit
                    >
                        <List component='div' disablePadding>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                    handleUpdateInfo(
                                        `Asistencias - Norcul`,
                                        `En curso`
                                    )
                                }
                            >
                                <ListItemIcon>
                                    <AccessTimeSharpIcon
                                        sx={{ color: "rgb(0, 102, 71)" }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    secondary='En curso'
                                    sx={{ color: "rgb(0, 0, 0)" }}
                                />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                    handleUpdateInfo(
                                        `Asistencias - Norcul`,
                                        `Próximas`
                                    )
                                }
                            >
                                <ListItemIcon>
                                    <ArrowForwardSharpIcon
                                        sx={{ color: "rgb(0, 102, 71)" }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    secondary='Próximas'
                                    sx={{ color: "rgb(0, 0, 0)" }}
                                />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() =>
                                    handleUpdateInfo(
                                        `Asistencias - Norcul`,
                                        `Pasadas`
                                    )
                                }
                            >
                                <ListItemIcon>
                                    <ArrowBackSharpIcon
                                        sx={{ color: "rgb(0, 102, 71)" }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    secondary='Pasadas'
                                    sx={{ color: "rgb(0, 0, 0)" }}
                                />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItemButton
                        onClick={() => handleUpdateInfo(`Norcul`, `Usuarios`)}
                    >
                        <ListItemIcon>
                            <SupervisedUserCircleSharpIcon
                                sx={{ color: "rgb(0, 102, 71)" }}
                                key='users'
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary='Usuarios'
                            sx={{ color: "rgb(0, 0, 0)" }}
                        />
                    </ListItemButton>
                    <Divider />
                </>
            )}
            <ListItemButton onClick={handleClickMyAssistances}>
                <ListItemIcon>
                    <PersonSharp
                        sx={{ color: "rgb(0, 102, 71)" }}
                        key='myassistances'
                    />
                </ListItemIcon>
                <ListItemText
                    primary='Mis asistencias'
                    sx={{ color: "rgb(0, 0, 0)" }}
                />
                {openMyAssistances ? (
                    <ExpandLess sx={{ color: "rgb(0, 102, 71)" }} />
                ) : (
                    <ExpandMore sx={{ color: "rgb(0, 102, 71)" }} />
                )}
            </ListItemButton>
            <Collapse in={openMyAssistances} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                    <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() =>
                            handleUpdateInfo(
                                `Mis Asistencias`,
                                `Nueva asistencia`
                            )
                        }
                    >
                        <ListItemIcon>
                            <AddSharpIcon sx={{ color: "rgb(0, 102, 71)" }} />
                        </ListItemIcon>
                        <ListItemText
                            secondary='Agregar'
                            sx={{ color: "rgb(0, 0, 0)" }}
                        />
                    </ListItemButton>
                    <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() =>
                            handleUpdateInfo(`Mis Asistencias`, `Próximas`)
                        }
                    >
                        <ListItemIcon>
                            <ArrowForwardSharpIcon
                                sx={{ color: "rgb(0, 102, 71)" }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            secondary='Próximas'
                            sx={{ color: "rgb(0, 0, 0)" }}
                        />
                    </ListItemButton>
                    <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() =>
                            handleUpdateInfo(`Mis Asistencias`, `Pasadas`)
                        }
                    >
                        <ListItemIcon>
                            <ArrowBackSharpIcon
                                sx={{ color: "rgb(0, 102, 71)" }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            secondary='Pasadas'
                            sx={{ color: "rgb(0, 0, 0)" }}
                        />
                    </ListItemButton>
                </List>
            </Collapse>
            {/**/}
            <ListItemButton onClick={handleClickInternAssistances}>
                <ListItemIcon>
                    <PeopleAltSharpIcon
                        sx={{ color: "rgb(0, 102, 71)" }}
                        key='internassistances'
                    />
                </ListItemIcon>
                <ListItemText
                    primary='Asistencias internos'
                    sx={{ color: "rgb(0, 0, 0)" }}
                />
                {openMyAssistances ? (
                    <ExpandLess sx={{ color: "rgb(0, 102, 71)" }} />
                ) : (
                    <ExpandMore sx={{ color: "rgb(0, 102, 71)" }} />
                )}
            </ListItemButton>
            <Collapse in={openInternAssistances} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                    <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() =>
                            handleUpdateInfo(
                                `Asistencias Internos`,
                                `Nueva asistencia`
                            )
                        }
                    >
                        <ListItemIcon>
                            <AddSharpIcon sx={{ color: "rgb(0, 102, 71)" }} />
                        </ListItemIcon>
                        <ListItemText
                            secondary='Agregar'
                            sx={{ color: "rgb(0, 0, 0)" }}
                        />
                    </ListItemButton>
                    <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() =>
                            handleUpdateInfo(`Asistencias Internos`, `Próximas`)
                        }
                    >
                        <ListItemIcon>
                            <ArrowForwardSharpIcon
                                sx={{ color: "rgb(0, 102, 71)" }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            secondary='Próximas'
                            sx={{ color: "rgb(0, 0, 0)" }}
                        />
                    </ListItemButton>
                    <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() =>
                            handleUpdateInfo(`Asistencias Internos`, `Pasadas`)
                        }
                    >
                        <ListItemIcon>
                            <ArrowBackSharpIcon
                                sx={{ color: "rgb(0, 102, 71)" }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            secondary='Pasadas'
                            sx={{ color: "rgb(0, 0, 0)" }}
                        />
                    </ListItemButton>
                </List>
            </Collapse>
            {/**/}
            <ListItemButton onClick={handleClickExternalAssistances}>
                <ListItemIcon>
                    <HailTwoToneIcon
                        sx={{ color: "rgb(0, 102, 71)" }}
                        key='externassistances'
                    />
                </ListItemIcon>
                <ListItemText
                    primary='Asistencias externos'
                    sx={{ color: "rgb(0, 0, 0)" }}
                />
                {openMyAssistances ? (
                    <ExpandLess sx={{ color: "rgb(0, 102, 71)" }} />
                ) : (
                    <ExpandMore sx={{ color: "rgb(0, 102, 71)" }} />
                )}
            </ListItemButton>
            <Collapse in={openExternalAssistances} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                    <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() =>
                            handleUpdateInfo(
                                `Asistencias Externos`,
                                `Nueva asistencia`
                            )
                        }
                    >
                        <ListItemIcon>
                            <AddSharpIcon sx={{ color: "rgb(0, 102, 71)" }} />
                        </ListItemIcon>
                        <ListItemText
                            secondary='Agregar'
                            sx={{ color: "rgb(0, 0, 0)" }}
                        />
                    </ListItemButton>
                    <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() =>
                            handleUpdateInfo(`Asistencias Externos`, `Próximas`)
                        }
                    >
                        <ListItemIcon>
                            <ArrowForwardSharpIcon
                                sx={{ color: "rgb(0, 102, 71)" }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            secondary='Próximas'
                            sx={{ color: "rgb(0, 0, 0)" }}
                        />
                    </ListItemButton>
                    <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() =>
                            handleUpdateInfo(`Asistencias Externos`, `Pasadas`)
                        }
                    >
                        <ListItemIcon>
                            <ArrowBackSharpIcon
                                sx={{ color: "rgb(0, 102, 71)" }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            secondary='Pasadas'
                            sx={{ color: "rgb(0, 0, 0)" }}
                        />
                    </ListItemButton>
                </List>
            </Collapse>
        </>
    );
};

export default ButtonCollapse;
