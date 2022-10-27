import axios from 'axios';
import Swal from 'sweetalert2';
import url from './URL';

export const changePassword = async ( oldPassword, newPassword ) => {
    const data = JSON.stringify( {
        "id":          sessionStorage.getItem( 'id' ),
        "oldPassword": oldPassword,
        "newPassword": newPassword,
        "token":       sessionStorage.getItem( 'token' )
    } ),
    config = {
        method: 'put',
        url: `/api/user/changePassword`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
    };

    await axios( config )
        .then( ( response ) => {
            Swal.fire(
                '¡Éxito!',
                'La contraseña ha sido cambiada.',
                'success'
            )
            .then( () => {
                window.location.reload();
            } );
        } )
        .catch( ( error ) => {
            console.log( error );
            Swal.fire(
                '¡Error!',
                error.response.data.msg || error.response.data.error || 'Ha ocurrido un error.',
                'error'
            );
        }  );
}