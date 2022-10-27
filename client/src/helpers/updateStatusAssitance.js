import axios from 'axios';
import url from './URL';

const updateStatus = async ( id, status ) => {
    const data = JSON.stringify( {
            'id': id,
            'status': status
        } ),
        config = {
            method: 'put',
            url: `/api/assistance/updatestatus`,
            headers: {
                'Content-Type': 'application/json'
            },
            data : data
        };
    return await axios( config )
}

export default updateStatus;