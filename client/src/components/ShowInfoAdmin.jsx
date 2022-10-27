import { useCallback } from "react";
import { Box } from "@mui/material";
import RegisterForMe from "./RegisterForMe";
import RegisterIntern from "./RegisterIntern";
import RegisterExternal from "./RegisterExternal";
import TableAssistancesEditableUser from "./TableAssistancesEditableUser";
import TableAssistancesAll from "./TableAssistancesAll";
import { GridUsers } from "./GridUsers";

const ShowTablesDash = ({ section, info }) => {
    const site = sessionStorage.getItem("site");
    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    margin: "auto",
                    marginTop: "2rem",
                }}
            >
                {section === false && info === false ? (
                    <TableAssistancesAll mode='all' type='current' />
                ) : section === `Asistencias - Norcul` &&
                  info === "En curso" ? (
                    <TableAssistancesAll mode='all' type='current' />
                ) : section === `Asistencias - Norcul` &&
                  info === "Próximas" ? (
                    <TableAssistancesAll mode='all' type='next' />
                ) : section === `Asistencias - Norcul` && info === "Pasadas" ? (
                    <TableAssistancesAll mode='all' type='past' />
                ) : section === "Mis Asistencias" &&
                  info === "Nueva asistencia" ? (
                    <RegisterForMe />
                ) : section === "Mis Asistencias" && info === "Próximas" ? (
                    <TableAssistancesEditableUser mode='user' type='next' />
                ) : section === "Mis Asistencias" && info === "Pasadas" ? (
                    <TableAssistancesEditableUser mode='user' type='past' />
                ) : section === "Asistencias Internos" &&
                  info === "Nueva asistencia" ? (
                    <RegisterIntern />
                ) : section === "Asistencias Internos" &&
                  info === "Próximas" ? (
                    <TableAssistancesEditableUser mode='third' type='next' />
                ) : section === "Asistencias Internos" && info === "Pasadas" ? (
                    <TableAssistancesEditableUser mode='third' type='past' />
                ) : section === "Asistencias Externos" &&
                  info === "Nueva asistencia" ? (
                    <RegisterExternal />
                ) : section === "Asistencias Externos" &&
                  info === "Próximas" ? (
                    <TableAssistancesEditableUser mode='external' type='next' />
                ) : section === "Asistencias Externos" && info === "Pasadas" ? (
                    <TableAssistancesEditableUser mode='external' type='past' />
                ) : section === "Norcul" && info === "Usuarios" ? (
                    // <TableUsers mode="admin-users" type='all' />
                    <GridUsers mode="admin-users" type='all' />
                ) : null}
            </Box>
        </>
    );
};

export default ShowTablesDash;
