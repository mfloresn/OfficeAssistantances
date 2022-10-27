import React from 'react';
import {
    useMediaQuery,
    Box,
    Typography,
    Select,
    MenuItem,
    TextField,
    Button,
} from "@mui/material";
import moment from "moment/moment";
import Alert from "./Alert";
import Swal from "sweetalert2";
import sendRegisterAssistanceExternal from "../helpers/sendRegisterAssistanceExternal";

const RegisterExternal = () => {
    const matches = useMediaQuery("( min-width: 850px )"),
        [name, setName] = React.useState(""),
        [site, setSite] = React.useState(""),
        [date, setDate] = React.useState(""),
        [startTime, setStartTime] = React.useState(""),
        [endTime, setEndTime] = React.useState(""),
        [area, setArea] = React.useState(""),
        [errorName, setErrorName] = React.useState(false),
        [errorDate, setErrorDate] = React.useState(false),
        [errorEntry, setErrorEntry] = React.useState(false),
        [errorExit, setErrorExit] = React.useState(false);

    const handleName = (event) => {
        setErrorName(false);
        /^[A-Za-z\s]+$/g.test(event.target.value)
            ? setName(event.target.value)
            : setErrorName(true);
    };
    const handleChangeSelect = (event) => setSite(event.target.value);
    const handleDate = (event) => setDate(event.target.value);
    const handleStartTime = (event) => setStartTime(event.target.value);
    const handleEndTime = (event) => setEndTime(event.target.value);
    const handleChangeArea = (event) => setArea(event.target.value);
    const handleSubmit = (event) => {
        event.preventDefault();
        if (
            name === "" ||
            site === "" ||
            date === "" ||
            startTime === "" ||
            endTime === "" ||
            area === ""
        ) {
            Alert("Error", "Todos los campos son obligatorios", "error");
        } else if (errorName || errorDate || errorEntry || errorExit) {
            Alert("Error", "Verifique los campos", "error");
        } else {
            let data = {
                logger: sessionStorage.getItem("id"),
                assistant: name.toLocaleUpperCase(),
                site: site,
                date: date,
                entry: startTime,
                exit: endTime,
                area: area,
            };
            sendRegisterAssistanceExternal(data)
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
                    console.log(error);
                    Alert("Ocurrió un error", error.response.data.msg, "error");
                });
        }
    };

    React.useEffect(() => {
        let today = moment(),
            start = moment(startTime, "HH:mm"),
            end = moment(endTime, "HH:mm"),
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
                <Box
                    sx={{
                        m: 1,
                        width: matches ? "90%" : "80%",
                    }}
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
                            color={errorName ? "error" : "primary"}
                            focused={errorName ? true : false}
                            label={errorName ? "Solo letras" : null}
                            sx={{ width: matches ? "50%" : "90%" }}
                            onChange={handleName}
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
                            size='small'
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
                                onChange={handleDate}
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
                                onChange={handleStartTime}
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
                                onChange={handleEndTime}
                            />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: matches ? "row" : "column",
                            marginTop: "2rem",
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
                                Area de trabajo
                            </Typography>
                        </Box>
                        <TextField
                            value={area}
                            onChange={handleChangeArea}
                            variant='outlined'
                            size='small'
                            sx={{ width: matches ? "50%" : "90%" }}
                        />
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
                        onClick={handleSubmit}
                    >
                        Guardar
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default RegisterExternal;
