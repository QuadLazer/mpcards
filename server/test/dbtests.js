const testdb = require('./connect.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../dbserver.js');
const bodyParser = require('body-parser');

chai.use(chaiHttp);
const {expect} = chai;

describe('Database Tests', () => {
    //tests go here
    // it('should return users', async() => {
    //     const response = await chai.request('http://localhost:3001').get('/users/fetchUsers');
    //     expect(response).to.have.status(200);
    //     expect(response.body[0]).to.have.property('uname','bbird');
    //     expect(response.body[0]).to.have.property('email','bbird@gmail.com');
    //     expect(response.body[0]).to.have.property('win_count');
    //     expect(response.body[0].win_count).to.not.be.null;
    //     expect(response.body.length).to.be.equal(3);
        
    // });

    // it('should register a user', async() => {

    //     let data = {
    //         email: "burner@gmail.com",
    //         password: "sufficient"
    //     }
    //     const response = await chai.request('http://localhost:3001').post('/users/register').send(data);
    //     expect(response).to.have.status(201);
    // });

    it('should list the new user', async() => {
        let userEmail = 'burner@gmail.com';
        const response = await chai.request('http://localhost:3001').get('/users/findUser/' + userEmail);
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('uname','burner@gmail.com');
        expect(response.body).to.have.property('email','burner@gmail.com');
        expect(response.body).to.have.property('win_count',0);
        expect(response.body).to.not.have.property('password');
    });

    it('reflects the new record size after adding a user', async() =>{
        const response = await chai.request('http://localhost:3001').get('/users/fetchUsers');
        expect(response).to.have.status(200);
        expect(response.body.length).to.be.equal(4);
        //records are returned in alphabetical order of user name
        expect(response.body[1]).to.have.property('uname','burner@gmail.com');
        expect(response.body[1]).to.have.property('email','burner@gmail.com');
        expect(response.body[1]).to.have.property('win_count', 0);
    });

    it('should delete a user', async() => {

        let data = {
                    username: "burner@gmail.com",
                    email: "burner@gmail.com",
                };

        const response = await chai.request('http://localhost:3001').delete('/users/delete').send(data);
        expect(response).to.have.status(200);

    });

});