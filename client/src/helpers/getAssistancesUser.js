import axios from 'axios';
import Swal from 'sweetalert2';
import url from './URL';

const getAssistancesUser = async ( user ) => {
    const config = {
        method: 'get',
        url: `/api/assistance/userassistance/${ user }`,
        headers: { 
          'Content-Type': 'application/json'
        },
    };
    
    try {
        const resp = await axios( config );
        return resp.data;
    } catch ( error ) {
        console.log( error );
        Swal.fire(
            '¡Error!',
            error.response.data.msg || error.response.data.error || 'Ha ocurrido un error.',
            'error'
        );
    }
}

export default getAssistancesUser;
