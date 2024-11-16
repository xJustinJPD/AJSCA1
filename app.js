const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

require('dotenv').config();
require('./configs/db.js');

// Checking for testing enviroment

if(process.env.ENVIRONMENT !== 'testing'){
    require('./configs/db.js').connect();
}

app.set('view engine','html');
app.use(express.json());

app.use(express.static(__dirname + '/views/'));



// AUTHORIZATION ///////
app.use((req, res, next)=>{
    let authHeader = req.headers?.authorization?.split(' ')

    if(req.headers?.authorization && authHeader[0] === 'Bearer'){
        jwt.verify(authHeader[1], process.env.JWT_SECRET, (err, decoded)=>{
            if(err) req.user = undefined
            req.user = decoded;
            next()
        })
    }
    else{
        req.user = undefined;
        next()
    }

    console.log(authHeader)

    return res.status(200)
})
// ////////////////////

app.use('/api/cars', require('./routes/cars'));
app.use('/api/users', require('./routes/users'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/mechanics', require('./routes/mechanics'));

module.exports = app;