import React from 'react';
import {
    ImageList,
    ImageListItem,
    Grid,
    Box,
    TextField,
    Button,
    FormControl,
} from '@mui/material';
import { Formik } from 'formik';
import Logo from '../assets/Norcul_500.png';
import login from '../helpers/login';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';

const LogIn = () => {
    const [disabled, setDisabled] = React.useState(false);
    sessionStorage.clear();

    return (
        <Box
            width='70%'
            height='80vh'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '3px solid rgb(0, 102, 71)',
                borderRadius: '10px',
                placeContent: 'center',
                boxShadow: '15px 15px 15px 0px rgb(0, 102, 71)',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '5vh',
            }}
        >
            <Grid>
                <ImageList
                    sx={{
                        width: {
                            xs: '30vh',
                            sm: '30vh',
                            md: '40vh',
                            lg: '50vh',
                            xl: '50vh',
                        },
                        height: 'auto',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                    cols={1}
                >
                    <ImageListItem key='norcul'>
                        <img src={Logo} alt='' />
                    </ImageListItem>
                </ImageList>
            </Grid>
            <Formik
                initialValues={{
                    user: '',
                    password: '',
                }}
                onSubmit={ async ( values ) => {
                    try {
                        setDisabled(true);
                        const response = login( values.user, values.password );
                        if ( response ) setDisabled(false);
                    } catch (error) {
                        console.log(error);
                    }
                }}
            >
                {({
                    values,
                    errors,
                    handleSubmit,
                    handleChange,
                    handleBlur,
                }) => (
                    <FormControl
                        component='form'
                        noValidate
                        sx={{
                            mt: 2,
                            width: '50%',
                        }}
                        onSubmit={handleSubmit}
                    >
                        <Box>
                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                name='user'
                                label='Usuario'
                                type='text'
                                id='user'
                                variant='standard'
                                color='success'
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                name='password'
                                label='Contraseña'
                                type='password'
                                id='password'
                                variant='standard'
                                color='success'
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <Button
                                type='submit'
                                color='success'
                                variant='outlined'
                                disabled={!values.user || !values.password || disabled }
                                sx={{
                                    width: '50%',
                                    textTransform: 'none',
                                    marginTop: '1vh',
                                }}
                            >
                                Entrar
                            </Button>
                        </Box>
                    </FormControl>
                )}
            </Formik>
            <ForgotPasswordModal />
        </Box>
    );
};

export default LogIn;
