import React from "react";
import {
    useMediaQuery,
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    TextField,
    Button,
} from "@mui/material";
import moment from "moment/moment";
import Swal from "sweetalert2";
import Alert from "./Alert";
import sendRegisterAssistance from "../helpers/sendRegisterAssistance";

const RegisterForMe = () => {
    const matches = useMediaQuery("( min-width: 850px )"),
        [site, setSite] = React.useState(""),
        [date, setDate] = React.useState(""),
        [entry, setEntry] = React.useState(""),
        [exit, setExit] = React.useState(""),
        [errorDate, setErrorDate] = React.useState(false),
        [errorEntry, setErrorEntry] = React.useState(false),
        [errorExit, setErrorExit] = React.useState(false),
        name = sessionStorage.getItem("name"),
        lastname = sessionStorage.getItem("lastname"),
        id = sessionStorage.getItem("id"),
        username = sessionStorage.getItem("username");

    const handleChangeSelect = (event) => setSite(event.target.value);
    const handleChangeDate = (event) => setDate(event.target.value);
    const handleChangeEntry = (event) => setEntry(event.target.value);
    const handleChangeExit = (event) => setExit(event.target.value);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (site === "" || date === "" || entry === "" || exit === "") {
            Alert("Error", "Todos los campos son obligatorios", "warning");
        } else {
            let value = {
                logger: id,
                assistant: username,
                site: site,
                date: date,
                entry: entry,
                exit: exit,
            };
            sendRegisterAssistance(value)
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
        let today = moment().format("YYYY-MM-DD"),
            nextMonth = moment().add(1, "months").format("YYYY-MM-DD"),
            start = moment(entry, "HH:mm"),
            end = moment(exit, "HH:mm"),
            hourEntry = moment("07:00", "HH:mm"),
            hourExit = moment("21:00", "HH:mm"),
            dateSelected = moment(date).format("YYYY-MM-DD");
        date !== "" && (today > dateSelected || dateSelected > nextMonth)
            ? setErrorDate(true)
            : setErrorDate(false);
        start !== "" && (start.isBefore(hourEntry) || start.isAfter(hourExit))
            ? setErrorEntry(true)
            : setErrorEntry(false);
        start !== "" && (end.isBefore(start) || end.isAfter(hourExit))
            ? setErrorExit(true)
            : setErrorExit(false);
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
                            sx={{ width: matches ? "50%" : "90%" }}
                            inputProps={{
                                value: `${name} ${lastname}`,
                                readOnly: true,
                            }}
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
                        onClick={handleSubmit}
                    >
                        Guardar
                    </Button>
                </FormControl>
            </Box>
        </>
    );
};

export default RegisterForMe;
