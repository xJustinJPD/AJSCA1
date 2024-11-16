require('dotenv').config();
const { connect, disconnect } = require('../configs/db');
const Driver = require('../models/driver.model');
const User = require('../models/user.model');

// seeding data for the database including a user and some drivers, this will be used when unit testing
const users = [
    {
        full_name: 'Justin PD',
        email: 'jpd@testingtime.com',
        password: 'secret'
    }
];

const drivers = [
    {
        firstname: "Ricky",
        lastname: "Bobby",
        age: "35"
    },
    {
        firstname: "Max",
        lastname: "Verstappen",
        age: "27"
    },
    {
        firstname: "Lando",
        lastname: "Norris",
        age: "25"
    },
    {
        firstname: "Daniel",
        lastname: "Ricciardo",
        age: "35"
    },
    {
        firstname: "Lewis",
        lastname: "Hamilton",
        age: "35"
    }
];

// Seeding function deleting users and drivers from the testing db then adding them back in

let seedDB = async () => {
    await connect();
    await User.deleteMany();
    await Driver.deleteMany();

    await User.insertMany(users);
    await Driver.insertMany(drivers);
};

seedDB().then(() => {
    console.log('Operation successfull!');
    disconnect();
});
