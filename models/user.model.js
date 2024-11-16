const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

// validation to check the email fits email transparency using regex to check if the format is correct
const validateEmail = (email) => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
}

const userSchema = new Schema({
    full_name: {
        type: String,
        required: [true],
        trim: [true]
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        // validate: [validateEmail, 'Please use a valid email address'],
        // in line matching with the email instead of using the regex function
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps:true});

// Function used to compare the password uaing bycryptjs
userSchema.methods.ComparePassword = function(password){
    return bcrypt.compareSync(password, this.password, function(result){
        return result
    });
}

module.exports = model('User', userSchema)