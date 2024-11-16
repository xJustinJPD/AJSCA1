const express = require('express');
const router = express.Router();

const imageUpload = require('../configs/imageUpload')


// importing the routes for cars
const { 
    readData, 
    readOne,
    createData,
    updateData,
    deleteData, 
} = require('../controllers/car.controller');

// importing the login required function to check if a user is logged in to allow them to utilise functionality

const { loginRequired } = require('../controllers/user.controller')

// router for cars, each middleware serves itsstatedpurpose, login is checked for all but view all
router
    .get('/', readData)
    .get('/:id', loginRequired, readOne)
    .post('/', imageUpload.single('image'),loginRequired, createData)
    .put('/:id', imageUpload.single('image'),loginRequired, updateData)
    .delete('/:id',loginRequired, deleteData);

module.exports = router;