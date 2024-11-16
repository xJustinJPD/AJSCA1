// const mongoose = require('mongoose');

// const init = async () => {
//     mongoose.set('debug', true);
//     mongoose.set('strictQuery', false);

//     let dbURL = process.env.DB_ATLAS_URL

//     if(process.env.ENVIRONMENT === 'testing'){
//         dbURL = process.env.TEST_DB_ATLAS_URL
//     }

//     await mongoose.connect(dbURL, {
//         useNewUrlParser: true
//     })
//     .catch(err => {
//         console.log(`Error: ${err.stack}`);
//         process.exit(1);
//     });

//     mongoose.connection.on('open', () => {
//         console.log('Connected to Database');
//     });
// };

const mongoose = require('mongoose');
let db;

const connect = async () => {
    db = null;

    try {
        mongoose.set('strictQuery', false);

        let dbURL = process.env.DB_ATLAS_URL;
        if(process.env.ENVIRONMENT === 'testing'){
            dbURL = process.env.TEST_DB_ATLAS_URL
        }

        await mongoose.connect(dbURL, {
            useNewUrlParser: true
        })

        console.log('Connected successfully to db');
        db = mongoose.connection;
    } catch (error) {
        console.log(error);
    } finally {
        if (db !== null && db.readyState === 1) {
        }
    }
};

const disconnect = async () => {
    await db.close();
};

module.exports = { connect, disconnect };

// module.exports = init;