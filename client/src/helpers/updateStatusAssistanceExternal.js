import axios from 'axios';
import url from './URL';

const updateStatusExternal = async ( id, status ) => {
    const data = JSON.stringify( {
            'id': id,
            'status': status
        } ),
        config = {
            method: 'put',
            url: `/api/assistance/updatestatusexternal`,
            headers: {
                'Content-Type': 'application/json'
            },
            data : data
        };
    return await axios( config );
}

export default updateStatusExternal;