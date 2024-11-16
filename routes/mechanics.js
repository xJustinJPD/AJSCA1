const express = require('express');
const router = express.Router();

const{ 
    readAll,
    readOne,
    createData,
    updateData,
    deleteData,
    } = require('../controllers/mechanic.controller')

    const { loginRequired, hasAdmin } = require('../controllers/user.controller')

router.get('/', readAll);

router.get('/:id', loginRequired, readOne);

router.post('/', loginRequired, createData);

router.put('/:id', loginRequired, updateData);

router.delete('/:id', loginRequired, deleteData);


module.exports = router;