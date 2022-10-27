import axios from 'axios';
import Swal from 'sweetalert2';
import url from './URL';

const login = async ( user, password ) => {
    const data = JSON.stringify( {
        "username":     user,
        "password": password
    } ),
    config = {
        method: 'post',
        url: `/api/user/login`,
        headers: {
            'Content-Type': 'application/json'
        },
        data : data
    };

    if( user.length === 0 || password.length === 0 ) return Swal.fire( '¡Error!', 'Todos los campos son obligatorios.', 'error' );

    try {
        await axios( config )
            .then( ( response ) => {
                sessionStorage.setItem( 'id',       response.data.user.id );
                sessionStorage.setItem( 'name',     response.data.user.name );
                sessionStorage.setItem( 'lastname', response.data.user.lastname );
                sessionStorage.setItem( 'site',     response.data.user.site );
                sessionStorage.setItem( 'username', response.data.user.username );
                sessionStorage.setItem( 'area',     response.data.user.area );
                sessionStorage.setItem( 'role',     response.data.user.role );
                sessionStorage.setItem( 'token',    response.data.token );
            } )
            .then( () => {
                window.location.reload();
            } )
            .catch( ( error ) => {
                console.log( error );
                Swal.fire({
                    icon: 'error',
                    title: 'Error al iniciar sesión',
                    text: error.response.data.error,
                    confirmButtonText: 'Aceptar'
                });
            } );  
    } catch (error) {
        console.log( error );
    }
}

export default login;