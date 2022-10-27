import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import { validateMail, validateName } from "../helpers/validateForm";

const FormEditUser = ({ handleClose, handleEditUser, data }) => {
    return (
        <>
            <Formik
                initialValues={{
                    name:     data.name,
                    lastname: data.lastname,
                    mail:     data.mail,
                    site:     data.site._id,
                    area:     data.area,
                    role:     data.role,
                }}
                onSubmit={async (values) => {
                    const dataUpdated = {
                        id:       data._id,
                        mail:     values.mail.toLowerCase(),
                        name:     values.name,
                        lastname: values.lastname,
                        site:     values.site,
                        area:     values.area,
                        role:     values.role,
                    };
                    handleEditUser(dataUpdated, handleClose);
                }}
                validate={(values) => {
                    const { name, lastname, mail, site, area, role } = values;
                    const errors = {};
                    if (!name) {
                        errors.name = "Campo requerido";
                    } else if (name.length < 3) {
                        errors.name = "Debe tener al menos 3 caracteres";
                    } else if (!validateName(name)) {
                        errors.name = "Solo se permiten letras";
                    }

                    if (!lastname) {
                        errors.lastname = "Campo requerido";
                    } else if (lastname.length < 3) {
                        errors.lastname = "Debe tener al menos 3 caracteres";
                    } else if (!validateName(lastname)) {
                        errors.lastname = "Solo se permiten letras";
                    }

                    if (!mail) {
                        errors.mail = "Campo requerido";
                    } else if (!validateMail(mail)) {
                        errors.mail = "Email no válido";
                    }

                    if (!site) errors.site = "Campo requerido";
                    if (!area) errors.area = "Campo requerido";
                    if (!role) errors.role = "Campo requerido";

                    return errors;
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleSubmit,
                    handleChange,
                    handleBlur,
                }) => (
                    <Box>
                        <TextField
                            required
                            fullWidth
                            id='mail'
                            label='Correo'
                            type='mail'
                            name='mail'
                            size="small"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={{ mb: 2 }}
                            error={touched.mail && Boolean(errors.mail)}
                            helperText={touched.mail && errors.mail}
                            defaultValue={values.mail}
                        />
                        <TextField
                            required
                            fullWidth
                            size='small'
                            name='name'
                            label='Nombre(s)'
                            type='text'
                            id='name'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={{ mb: 2 }}
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            defaultValue={values.name}
                        />
                        <TextField
                            required
                            fullWidth
                            size='small'
                            name='lastname'
                            label='Apellidos'
                            type='text'
                            id='lastname'
                            variant='outlined'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={{ mb: 2 }}
                            error={touched.lastname && Boolean(errors.lastname)}
                            helperText={touched.lastname && errors.lastname}
                            defaultValue={values.lastname}
                        />
                        <TextField
                            labelId='site'
                            id='site'
                            name='site'
                            onChange={handleChange}
                            value={values.site}
                            variant='outlined'
                            select
                            label='Sitio'
                            size='small'
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                            error={touched.site && Boolean(errors.site)}
                            helperText={touched.site && errors.site}
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
                        </TextField>
                        <TextField
                            labelId='area'
                            id='area'
                            name='area'
                            onChange={handleChange}
                            value={values.area}
                            variant='outlined'
                            select
                            label='Área'
                            size='small'
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                            error={touched.area && Boolean(errors.area)}
                            helperText={touched.area && errors.area}
                        >
                            <MenuItem value='ALM'>ALM</MenuItem>
                            <MenuItem value='CH'>CH</MenuItem>
                            <MenuItem value='TAC'>TAC</MenuItem>
                            <MenuItem value='CHE'>CHE</MenuItem>
                            <MenuItem value='CLE'>CLE</MenuItem>
                            <MenuItem value='CM'>CM</MenuItem>
                            <MenuItem value='CYA'>CYA</MenuItem>
                            <MenuItem value='Ejecución'>Ejecución</MenuItem>
                            <MenuItem value='IA'>IA</MenuItem>
                            <MenuItem value='IS'>IS</MenuItem>
                            <MenuItem value='IT'>IT</MenuItem>
                            <MenuItem value='LCI'>LCI</MenuItem>
                            <MenuItem value='MKT'>MKT</MenuItem>
                            <MenuItem value='SC'>SC</MenuItem>
                        </TextField>
                        <TextField
                            labelId='role'
                            id='role'
                            name='role'
                            onChange={handleChange}
                            value={values.role}
                            variant='outlined'
                            select
                            label='Tipo de usuario'
                            size='small'
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                            error={touched.role && Boolean(errors.role)}
                            helperText={touched.role && errors.role}
                        >
                            <MenuItem value='user'>Usuario</MenuItem>
                            <MenuItem value='manager'>
                                Encargado de inmueble
                            </MenuItem>
                        </TextField>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 2,
                            }}
                        >
                            <Button
                                type='submit'
                                variant='outlined'
                                color='error'
                                sx={{
                                    width: "100px",
                                    textTransform: "none",
                                    marginTop: "0.5rem",
                                    marginRight: "1vw",
                                }}
                                onClick={handleClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                sx={{
                                    width: "100px",
                                    textTransform: "none",
                                    marginTop: "0.5rem",
                                }}
                                disabled={
                                    errors.mail ||
                                    errors.name ||
                                    errors.lastname ||
                                    errors.site ||
                                    errors.area ||
                                    errors.role
                                }
                                onClick={handleSubmit}
                            >
                                Registrar
                            </Button>
                        </Box>
                    </Box>
                )}
            </Formik>
        </>
    );
};

export default FormEditUser;
