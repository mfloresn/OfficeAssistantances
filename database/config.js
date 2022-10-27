const mongoose = require( 'mongoose' );

const dbConnection = () => {
    try {
        mongoose.connect(
            `mongodb+srv://${ process.env.USER }:${ process.env.PASSWORD }@assistanceoffice.zke1pea.mongodb.net/${ process.env.DBNAME }?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log( 'DB Online' );
    } catch ( error ) {
        console.log( error );
        throw new Error( 'Error: ', error );
    }
}

module.exports = {
    dbConnection,
};