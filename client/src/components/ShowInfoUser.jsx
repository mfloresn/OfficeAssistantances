import { useCallback } from "react";
import { Box } from "@mui/material";
import RegisterForMe from "./RegisterForMe";
import RegisterIntern from "./RegisterIntern";
import RegisterExternal from "./RegisterExternal";
import TableAssistancesEditableUser from "./TableAssistancesEditableUser";

const ShowTablesDash = ({ section, info }) => {
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
                    <RegisterForMe />
                ) : section === "Mis Asistencias" && info === "Nueva asistencia" ? (
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
