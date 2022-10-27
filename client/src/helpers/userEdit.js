import axios from 'axios';
import url from './URL';

export const userEdit = ( user ) => {
    const data = JSON.stringify( user ),
        config = {
            method: 'put',
            url: `/api/user/update`,
            headers: {
                'Content-Type': 'application/json'
            },
            data : data
        };

    return axios( config );
}
