const { connect, disconnect} = require('../configs/db')
const request = require('supertest')
const app = require('../server')
const User = require('../models/user.model')
const jwt = require('jsonwebtoken');

let token;

// using a befor and after all function to connect then disconnect from the database after testing 

beforeAll(async() => {
    await connect()

    let user = await User.findOne({
        email: 'jpd@testingtime.com',
    });

    // signing in to the db with the user

    token = jwt.sign({
        full_name: user.full_name,
        email: user.email,
        password: user.password,
        _id: user._id
    }, process.env.JWT_SECRET)

})

afterAll(async() => {
    await disconnect()
})

// TESTS
describe('Get all drivers', () =>{
    test('Should retrieve an array of drivers', async() => {


        const res = await request(app).get('/api/drivers')
        driverId = res.body[1]._id
        expect(res.statusCode).toEqual(200);
    })
})

describe('Get single driver', () =>{
        test('Should retrieve a driver', async() => {
            const res = await request(app).get(`/api/drivers/${driverId}`)
                                        .set('Authorization', `Bearer ${token}`)

            expect(res.statusCode).toEqual(200)
        })


})

describe('Create and retrieve driver', () =>{

    let newDriverId;
    let newDriver_Name;

    test('Should create and retrieve a driver', async() => {
        const driver = { first_name: "Justin", last_name: "Perry Doyle", age: "23", car: "6716566713aca2f5a263ab54"}
        const res = await request(app).post('/api/drivers')
                                    .send(driver)
                                    .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(201)
        newDriverId = res.body._id;
        newDriver_Name = res.body.first_name;
    })

    test('Should retrieve new driver', async() => {
        const res = await request(app).get(`/api/drivers/${newDriverId}`)
                                    .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.first_name).toEqual(newDriver_Name)
    })


})