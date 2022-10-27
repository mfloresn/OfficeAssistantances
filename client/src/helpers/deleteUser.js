import axios from 'axios';
import url from './URL';

const deleteUser = async ( id ) => {
    const data = JSON.stringify( {
            "id": id,
            "token": sessionStorage.getItem( 'token' )
        } ),
        config = {
            method: 'delete',
            url: `/api/user/delete`,
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
        };

    return await axios( config );
}

export default deleteUser;
