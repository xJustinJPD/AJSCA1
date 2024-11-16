const Mechanic = require('../models/mechanic.model')
const Car = require('../models/car.model')

const readAll = (req,res) => {
    //database connection goes here
    Mechanic.find()
    .then(data => {
        console.log(data);
        if(data.length > 0){
            return res.status(200).json(data)
        }
        else{
            return res.status(404).json("None found")
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json(err)
    })
}
const readOne = (req,res) => {
    let id = req.params.id;
    Mechanic.findById(id)
    .then(data => {
        if(!data){
            return res.status(404).json({
                message: `Mechanic with id: ${id} not found`
            })
        }
        return res.status(200).json({
            message: `Mechanic with id: ${id} retrieved`,
            data
        })
    })
    .catch(err => {
        if(err.name === "CastError"){
            return res.status(404).json(`Mechanic with id: ${id} not found`);
        }
        console.log(err);
        return res.status(500).json(err)
    })
}

const addMechanicsToCars = async (mechanic_id, car_ids) => {
    try {
    await Car.updateMany(
        { _id: { $in: car_ids } },
        { $addToSet: { mechanics: mechanic_id } }
    )
    }
    catch (error) {
    console.error(error)
    }
}

const createData = (req,res) => {
    console.log(req.body)
    let body = req.body;

    Mechanic.create(body)
        .then(data => {
            if(data.cars){
                for(i=0; i<data.cars.length; i++){
                    addMechanicsToCars(data._id, data.cars[i]._id)
                }
            }
            console.log(`mechanic created`, data);
            return res.status(201).json({
                message: "Mechanic created",
                data
            })
        })
        .catch(err => {
            
            console.log(err);
            if(err.name === 'ValidationError'){
                return res.status(422).json({
                    error:err
                })
            }
            return res.status(500).json(err)
        })
}





const updateData = (req,res) => {
    let id = req.params.id;
    let body = req.body;

    Mechanic.findByIdAndUpdate(id,body, {
        new:true,
        runValidators:true,
    })
        .then(data => {

            if(data.cars){
                for(i=0; i<data.cars.length; i++){
                    addMechanicsToCars(data._id, data.cars[i]._id)
                }
            }
            
            if(data){
                return res.status(201).json(data)
            }



            return res.status(404).json({
                message: `Mechanic with id: ${id} not found`
            })
        })
        .catch(err => {
            console.log(err)
            if(err.name === "CastError"){
                return res.status(404).json(err);
            }
            else if(err.name === 'ValidationError'){
                return res.status(422).json({
                    error:err
                })
            }
            return res.status(500).json(err)
        })
}
const deleteData = (req,res) => {
    let id = req.params.id;

    Mechanic.findByIdAndUpdate(id, { deleted: true}, {new: true})
    .then((data) => {

        if(!data){
            res.status(404).json({
                "message": `Mechanic with id: ${id} not found`
            });
        }
        else {
            res.status(200).json({
                "message": `Mechanic with id: ${id} deleted successfully`
            });
        }
        
    })
    .catch((err) => {
        console.error(err);
        if(err.name === 'CastError') {
            res.status(400).json({
                "message": `Bad request, ${id} is not a valid id`
            });
        }
        else {
            res.status(500).json(err)
        } 
    });
}

module.exports = {
    readAll,
    readOne,
    createData,
    updateData,
    deleteData
}