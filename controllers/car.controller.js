const Car = require('../models/car.model');
const { deleteOne } = require('../models/user.model');
const Mechanic = require('../models/mechanic.model');
const { findById } = require('../models/driver.model');


// Reading all data for cars
const readData = (req, res) => {
    Car.find()
        .then((data) => {
            console.log(data);
            if(data.length > 0){
                res.status(200).json(data);
            }
            else{
                res.status(404).json("None found");
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};


// Reading a singular car instead of all, pulling using the ID of the car in question in the request parameters sent using a JSON object through insomnia
const readOne = (req, res) => {

    // Allowing the id to be accessed easier
    let id = req.params.id;

    Car.findById(id)
        .then((data) => {

            if(data){
                res.status(200).json(data);
            }
            else {
                res.status(404).json({
                    "message": `Car with id: ${id} not found`
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

};

// const createData = (req, res) => {

//     let carData = req.body

//     console.log(carData)

//     console.log(req.file)
    
//     if(req.file){
//         carData.image_path = process.env.STORAGE_ENGINE === "S3" ? req.file.key : req.file.filename;
//     }



//     Car.create(carData)
//         .then((data) => {
//             console.log('New Car Created!', data);
//             res.status(201).json(data);
//         })
//         .catch((err) => {
//             if(err.name === 'ValidationError'){
//                 console.error('Validation Error!!', err);
//                 res.status(422).json({
//                     "msg": "Validation Error",
//                     "error" : err.message 
//                 });
//             }
//             else {
//                 console.error(err);
//                 res.status(500).json(err);
//             }
//         });

        

// };

// Adding cars to mechanics to allow for the many to many relationship to exist and push both entities values into eachother when creating/updating
const addCarsToMechanics = async (car_id, mechanic_ids) => {
    try {
    await Mechanic.updateMany(
        { _id: { $in: mechanic_ids } },
        { $addToSet: { cars: car_id } }
    )
    }
    catch (error) {
    console.error(error)
    }
}


// Creating a car, sending a request JSON object of the car, based on the car model
const createData = (req, res, next) => {
    

    // Allowing the data to be accessed more simply by storing it in carData
    let carData = req.body;
    
    // Checking if the image storage path is disk or S3 to then store the image sent in the cars object
    if(req.file){
        carData.image_path = process.env.STORAGE_ENGINE === "S3" ? req.file.key : req.file.filename;
    }

    // Sending the create function to mongoDB
    Car.create(carData)
    .then((data) => {
            // Inserting car id into the mechanics car array using a loop to loop through the mechanics array in the car object,
            // then finding those mechanics by ID, and finally pushing the car ID into that mechanics cars array,and repeating
        if(data.mechanics){
            for(i=0; i<data.mechanics.length; i++){
                addCarsToMechanics(data._id, data.mechanics[i]._id)
            }
        }
        console.log('New Car Created!', data);
        res.status(201).json(data);
    })
    .catch((err) => {
        if(err.name === 'ValidationError'){
            console.error('Validation Error!!', err);
            res.status(422).json({
                "msg": "Validation Error",
                "error" : err.message 
            });
        }
        else {
            console.error(err);
            res.status(500).json(err);
        }
    });
};

// const addCarToMechanic = async (req,res) => {
//     const { carId, mechanicId } = req.body;
//     try {
//         // Find Car
//         const mechanic = await Mechanic.findById(mechanicId);
//         if (!car) return res.status(404).send('Car not found');
    
//         // Add mechanic to the car's mechanics array
//         car.mechanics.push(mechanicId);
//         await car.save();
    
//         // Find the mechanic and add the car to it
//         const mechanic = await Mechanic.findById(mechanicId);
//         if (!mechanic) return res.status(404).send('Mechanic not found');
    
//         mechanic.cars.push(carId);
//         await mechanic.save();
    
//         res.status(200).send('Mechanic added to car and car added to mechanic');
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// }


// Updating the car
const updateData = (req, res) => {

    // Allowing body and ID to be accessed easier
    let id = req.params.id;
    let body = req.body;


    // Finding the car in question by ID and updating it with the new data from the new request
    Car.findByIdAndUpdate(id, body, {
        new: true
    })
        .then((data) => {

            // Inserting car id into any new mechanics added in the update using a loop to loop through the mechanics array in the car object,
            // then finding those mechanics by ID, and finally pushing the car ID into that mechanics array,and repeating
            if(data.mechanics){
                for(i=0; i<data.mechanics.length; i++){
                    addCarsToMechanics(data._id, data.mechanics[i]._id)
                }
            }

            if(data){
                res.status(201).json(data);
            }
            else {
                res.status(404).json({
                    "message": `Car with id: ${id} not found`
                });
            }
            
        })
        .catch((err) => {
            if(err.name === 'ValidationError'){
                console.error('Validation Error!!', err);
                res.status(422).json({
                    "msg": "Validation Error",
                    "error" : err.message 
                });
            }
            else if(err.name === 'CastError') {
                res.status(400).json({
                    "message": `Bad request, ${id} is not a valid id`
                });
            }
            else {
                console.error(err);
                res.status(500).json(err);
            }
        });


};

// Deleting the data from the database, the commented code is the full delete for this data, but here we want to utilise a soft delete as to keep the data stored but with a deleted tag.
const deleteData = (req, res) => {

    // if(process.env.STORAGE_ENGINE === "S3"){
    //     const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3')
    //     const s3 = new S3Client({
    //         region: process.env.MY_AWS_REGION,
    //         credentials: {
    //             accessKeyId: process.env.MY_AWS_ACCESS_KEY,
    //             secretAccessKey: process.env.MY_AWS_SECRET_KEY
    //         }
    //     });

    //     try{
    //         const data = await s3.send(new DeleteObjectCommand({
    //             Bucket: process.env.MY_AWS_BUCKET,
    //             Key: filename
    //         }))

    //         console.log('object deleted', data)
    //     }
    //     catch(err){
    //         console.error(err)
    //     }
    // }

    let id = req.params.id;

    // Using a findby and update to update the deleted atribute of the data to true, this can then be used in the front end to only display the non deleted data.

    Car.findByIdAndUpdate(id, { deleted: true}, {new: true})
        .then((data) => {
            if(!data){
                res.status(404).json({
                    "message": `Car with id: ${id} not found`
                });
            }
            else {
                res.status(200).json({
                    "message": `Car with id: ${id} deleted successfully`
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


};

// Exporting all functions
module.exports = {
    readData,
    readOne,
    createData,
    updateData,
    deleteData
};


