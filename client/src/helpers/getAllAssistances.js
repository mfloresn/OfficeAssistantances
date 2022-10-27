import axios from 'axios';
import Swal from 'sweetalert2';
import url from './URL';

const getAllAssistancesInterns = async () => {
    const config = {
        method: 'get',
        url: `/api/assistance/`,
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

const getAllAssistancesExterns = async () => {
    const config = {
        method: 'get',
        url: `/api/assistance/external`,
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
const getAllAssistances = async ( site ) => {
    const assistances = {},
        next = [],
        inCourse = [],
        past = [];
    
    getAllAssistancesInterns().then( ( data ) => {
        data.next && next.push( ...data.next );
        data.inCourse && inCourse.push( ...data.inCourse );
        data.past && past.push( ...data.past );
    } );
    getAllAssistancesExterns().then( ( data ) => {
        data.next && next.push( ...data.next );
        data.inCourse && inCourse.push( ...data.inCourse );
        data.past && past.push( ...data.past );
    } );

    assistances.next = next;
    assistances.inCourse = inCourse;
    assistances.past = past;

    return assistances;
}

export default getAllAssistances;