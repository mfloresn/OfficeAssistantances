import { useCallback } from "react";
import { Box } from "@mui/material";
import RegisterForMe from "./RegisterForMe";
import RegisterIntern from "./RegisterIntern";
import RegisterExternal from "./RegisterExternal";
import TableAssistancesManager from "./TableAssistancesManager";
import TableAssistancesEditableUser from "./TableAssistancesEditableUser";

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
                    <TableAssistancesEditableUser mode='site' type='current' />
                ) : section === `Asistencias - ${site}` &&
                  info === "En curso" ? (
                    <TableAssistancesEditableUser mode='site' type='current' />
                ) : section === `Asistencias - ${site}` &&
                  info === "Próximas" ? (
                    <TableAssistancesManager mode='site' type='next' />
                ) : section === `Asistencias - ${site}` &&
                  info === "Pasadas" ? (
                    <TableAssistancesEditableUser mode='site' type='past' />
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
                ) : null}
            </Box>
        </>
    );
};

export default ShowTablesDash;
