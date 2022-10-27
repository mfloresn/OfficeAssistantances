import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent( Swal );

const Alert = ( title, text, icon ) => {
    MySwal.fire( {
        width: 400,
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1565C0',
    } );
};

export default Alert;