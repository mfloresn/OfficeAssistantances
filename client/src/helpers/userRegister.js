import axios from 'axios';
import url from './URL';

export const userRegister = ( user ) => {
    const data = JSON.stringify( user ),
        config = {
            method: 'post',
            url: `/api/user/register`,
            headers: {
                'Content-Type': 'application/json'
            },
            data : data
        };

    return axios( config );
}
