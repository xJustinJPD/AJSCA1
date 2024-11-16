const {Schema, model} = require('mongoose');

const driverSchema = new Schema({
    firstname: {
        type: String,
        required: [true, 'First name is required']
    },
    lastname: {
        type: String,
        required: [true, 'Last name is required']
    },
    age: {
        type: String,
        required: [true, 'Age is required']
    },
    deleted: {
        type: Boolean,
        default: false
    },
    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car'
    }
}, {timestamps:true});

module.exports = model('Driver', driverSchema)