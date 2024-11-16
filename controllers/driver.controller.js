const Driver = require('../models/driver.model')
const Car = require('../models/car.model')

const readAll = (req,res) => {
    //database connection goes here
    Driver.find().populate('car')
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
    // res.status(200).json({
    //     "message":"All drivers Recieved"
    // });
}
const readOne = (req,res) => {
    let id = req.params.id;
    Driver.findById(id).populate('car')
    .then(data => {
        if(!data){
            return res.status(404).json({
                message: `Driver with id: ${id} not found`
            })
        }
        return res.status(200).json({
            message: `Driver with id: ${id} retrieved`,
            data
        })
    })
    .catch(err => {
        if(err.name === "CastError"){
            return res.status(404).json(`Driver with id: ${id} not found`);
        }
        console.log(err);
        return res.status(500).json(err)
    })
    // res.status(200).json({
    //     "message":`This drivers id is ${id}` 
    // });
}

const addDriversToCars = async (driver_id, car_ids) => {
    try {
    await Car.updateMany(
        { _id: { $in: car_ids } },
        { $addToSet: { drivers: driver_id } }
    )
    }
    catch (error) {
    console.error(error)
    }
}

const createData = (req,res) => {
    console.log(req.body)
    let body = req.body;

    Driver.create(body)
        .then(data => {
            addDriversToCars(data._id, data.car._id)
            console.log(`driver created`, data);
            return res.status(201).json({
                message: "Driver created",
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
    // return res.status(201).json({
    //     "message":"driver created",
    //     data

    // });
}

const updateData = (req,res) => {
    let id = req.params.id;
    let body = req.body;

    Driver.findByIdAndUpdate(id,body, {
        new:true,
        runValidators:true,
    })
        .then(data => {
            if(data){
                return res.status(201).json(data)
            }

            return res.status(404).json({
                message: `Driver with id: ${id} not found`
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
    // data.id = id;
    //connect to db and check if driver exists
    //check if data is valid if yes update driver with :id
    // return res.status(200).json({
    //     "message":`driver updated with id ${id} `,
    //     data

    // });
}
const deleteData = (req,res) => {
    let id = req.params.id;

    Driver.findByIdAndUpdate(id, { deleted: true}, {new: true})
    .then((data) => {

        if(!data){
            res.status(404).json({
                "message": `Driver with id: ${id} not found`
            });
        }
        else {
            res.status(200).json({
                "message": `Driver with id: ${id} deleted successfully`
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

    // Driver.findByIdAndDelete(id)
    // .then(data => {
    //     if(!data){
    //         return res.status(404).json({ message: `Driver with id ${id} not found` });
    //     }
    //     return res.status(200).json({
    //     "message":`Driver deleted with id: ${id} `});
    // })
    // .catch(err => {
    //     console.log(err)
    //     if(err.name === "CastError"){
    //         return res.status(404).json(`Driver with id: ${id} not found`);
    //     }
    //     return res.status(500).json(err)
    // })
    //connect to db and check if driver exists
    // return res.status(200).json({
    //     "message":`driver Deleted with id ${id} `,

    // });
}

module.exports = {
    readAll,
    readOne,
    createData,
    updateData,
    deleteData
}