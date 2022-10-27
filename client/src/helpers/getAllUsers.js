import axios from 'axios';
import Swal from 'sweetalert2';
import url from './URL';

const getAllUsers = async () => {
        const config = {
            method: 'get',
            url: `/api/user/`,
            headers: { 
              'Content-Type': 'application/json'
            },
        };
    
    try {
        const resp = await axios( config );
        let user = resp.data.users;
        return user;
    } catch ( error ) {
        console.log( error.response.data );
        Swal.fire(
            '¡Error!',
            error.response.data.msg || error.response.data.error || 'Ha ocurrido un error.',
            'error'
        );
    }
}

export default getAllUsers;
