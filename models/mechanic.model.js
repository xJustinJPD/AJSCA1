const {Schema, model} = require('mongoose');

const mechanicSchema = new Schema({
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
    cars: [{
            type: Schema.Types.ObjectId,
            ref: 'Car',
    }]
}, {timestamps:true});

module.exports = model('Mechanic', mechanicSchema)