import React from "react";
import {
    useMediaQuery,
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    Button,
    TextField,
} from "@mui/material";
import moment from "moment/moment";
import Alert from "./Alert";
import Swal from "sweetalert2";
import sendRegisterAssistance from "../helpers/sendRegisterAssistance";

const RegisterIntern = () => {
    const matches = useMediaQuery("( min-width: 850px )"),
        [assistant, setAssistant] = React.useState(""),
        [site, setSite] = React.useState(""),
        [date, setDate] = React.useState(""),
        [entry, setEntry] = React.useState(""),
        [exit, setExit] = React.useState(""),
        [errorAssistant, setErrorAssistant] = React.useState(false),
        [errorDate, setErrorDate] = React.useState(false),
        [errorEntry, setErrorEntry] = React.useState(false),
        [errorExit, setErrorExit] = React.useState(false),
        id = sessionStorage.getItem("id");

    const handleChangeSelect = (event) => setSite(event.target.value);
    const handleChangeAssistant = (event) => {
        setErrorAssistant(false);
        /^[a-z]+$/g.test(event.target.value)
            ? setAssistant(event.target.value)
            : setErrorAssistant(true);
    };
    const handleChangeDate = (event) => setDate(event.target.value);
    const handleChangeEntry = (event) => setEntry(event.target.value);
    const handleChangeExit = (event) => setExit(event.target.value);
    const handleSubmit = (event) => {
        event.preventDefault();
        if (
            assistant === "" ||
            site === "" ||
            date === "" ||
            entry === "" ||
            exit === ""
        ) {
            Alert("Error", "Todos los campos son obligatorios", "error");
        } else if (errorAssistant || errorDate || errorEntry || errorExit) {
            Alert("Error", "Verifica los campos", "error");
        } else {
            const data = {
                logger: id,
                assistant: assistant.toLocaleLowerCase(),
                site: site,
                date: date,
                entry: entry,
                exit: exit,
            };
            sendRegisterAssistance(data)
                .then((response) => {
                    if (response.status === 200) {
                        Swal.fire( {
                            width: 400,
                            title: "Registro exitoso",
                            icon: "success",
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#1565C0',
                        } ).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                    }
                })
                .catch((error) => {
                    Alert("Ocurrió un error", error.response.data.msg, "error");
                });
        }
    };

    React.useEffect(() => {
        let today = moment(),
            start = moment(entry, "HH:mm"),
            end = moment(exit, "HH:mm"),
            hourEntry = moment("07:00", "HH:mm"),
            hourExit = moment("21:00", "HH:mm"),
            dateSelected = moment(date).format("YYYY-MM-DD");
        if (date !== "") {
            today > dateSelected ? setErrorDate(true) : setErrorDate(false);
        }
        if (start !== "") {
            start.isBefore(hourEntry) || start.isAfter(hourExit)
                ? setErrorEntry(true)
                : setErrorEntry(false);
        }
        if (start !== "") {
            end.isBefore(start) || end.isAfter(hourExit)
                ? setErrorExit(true)
                : setErrorExit(false);
        }
    });

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                }}
            >
                <FormControl
                    sx={{
                        m: 1,
                        width: matches ? "90%" : "80%",
                    }}
                    size='small'
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: matches ? "row" : "column",
                        }}
                    >
                        <Box
                            sx={{
                                width: matches ? "20%" : "100%",
                            }}
                        >
                            <Typography
                                sx={{
                                    textAlign: matches ? "left" : "center",
                                    marginRight: matches ? "2rem" : "0px",
                                }}
                            >
                                Asistente
                            </Typography>
                        </Box>
                        <TextField
                            variant='outlined'
                            size='small'
                            color={errorAssistant ? "error" : "primary"}
                            focused={errorAssistant ? true : false}
                            label={
                                errorAssistant
                                    ? "Solo letras minúsculas y sin espacios ni carácteres especiales"
                                    : null
                            }
                            sx={{ width: matches ? "50%" : "90%" }}
                            inputProps={{
                                placeholder: "Ej: oabundis",
                            }}
                            onChange={handleChangeAssistant}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: matches ? "row" : "column",
                            marginTop: "1rem",
                        }}
                    >
                        <Box
                            sx={{
                                width: matches ? "20%" : "80%",
                            }}
                        >
                            <Typography
                                sx={{
                                    textAlign: matches ? "left" : "center",
                                    marginRight: matches ? "2rem" : "0px",
                                }}
                            >
                                Sitio
                            </Typography>
                        </Box>
                        <Select
                            labelId='select-site'
                            id='select-site'
                            value={site}
                            onChange={handleChangeSelect}
                            variant='outlined'
                            sx={{ width: matches ? "50%" : "90%" }}
                        >
                            <MenuItem value='62f180168ecc6b7a88f0fc6f'>
                                Tajín
                            </MenuItem>
                            <MenuItem value='62f1802c8ecc6b7a88f0fc72'>
                                Cuenca
                            </MenuItem>
                            <MenuItem value='62f1803b8ecc6b7a88f0fc74'>
                                Leyes de Reforma
                            </MenuItem>
                            <MenuItem value='62f180578ecc6b7a88f0fc76'>
                                Monterrey
                            </MenuItem>
                            <MenuItem value='6333093695cc6762ffdada17'>
                                Capital Humano
                            </MenuItem>
                        </Select>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: matches ? "row" : "column",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "1rem",
                            width: "100%",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                marginRight: matches ? "2rem" : "0",
                                marginLeft: matches ? "2rem" : "0",
                                width: matches ? "60%" : "90%",
                            }}
                        >
                            <Typography>Fecha</Typography>
                            <TextField
                                type='date'
                                variant='outlined'
                                size='small'
                                sx={{ width: "100%" }}
                                color={errorDate ? "error" : "primary"}
                                focused={errorDate ? true : false}
                                onChange={handleChangeDate}
                            />
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                marginTop: matches ? "0" : "1rem",
                                marginRight: matches ? "2rem" : "0",
                                marginLeft: matches ? "2rem" : "0",
                                width: matches ? "60%" : "90%",
                            }}
                        >
                            <Typography>Hora de entrada</Typography>
                            <TextField
                                type='time'
                                variant='outlined'
                                size='small'
                                color={errorEntry ? "error" : "primary"}
                                focused={errorEntry ? true : false}
                                sx={{ width: "100%" }}
                                onChange={handleChangeEntry}
                            />
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                marginTop: matches ? "0" : "1rem",
                                marginRight: matches ? "2rem" : "0",
                                marginLeft: matches ? "2rem" : "0",
                                width: matches ? "60%" : "90%",
                            }}
                        >
                            <Typography>Hora de salida</Typography>
                            <TextField
                                type='time'
                                variant='outlined'
                                size='small'
                                color={errorExit ? "error" : "primary"}
                                focused={errorExit ? true : false}
                                sx={{ width: "100%" }}
                                onChange={handleChangeExit}
                            />
                        </Box>
                    </Box>
                    <Button
                        variant='outlined'
                        sx={{
                            marginTop: "2rem",
                            width: "20%",
                            textTransform: "none",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                        disabled={
                            errorAssistant ||
                            errorDate ||
                            errorEntry ||
                            errorExit
                                ? true
                                : false
                        }
                        onClick={handleSubmit}
                    >
                        Guardar
                    </Button>
                </FormControl>
            </Box>
        </>
    );
};

export default RegisterIntern;
