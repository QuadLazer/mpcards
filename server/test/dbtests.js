
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../dbserver.js');
const bodyParser = require('body-parser');

chai.use(chaiHttp);
const {expect} = chai;

describe('Database Tests', () => {
    //tests go here
    it('should return users', async() => {
        const response = await chai.request('http://localhost:3001').get('/users/fetchUsers');
        expect(response).to.have.status(200);
        expect(response.body[0]).to.have.property('uname','bbird');
        expect(response.body[0]).to.have.property('email','bbird@gmail.com');
        expect(response.body[0]).to.have.property('win_count');
        expect(response.body[0].win_count).to.not.be.null;
        expect(response.body.length).to.be.equal(3);
        
    });

    it('should register a user', async() => {

        let data = {
            email: "burner@gmail.com",
            password: "sufficient"
        }
        const response = await chai.request('http://localhost:3001').post('/users/register').send(data);
        expect(response).to.have.status(201);
    });

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

    it('should update a username', async() => {
        let data = {
            username: "burner@gmail.com",
            email: "burner@gmail.com",
            newUsername: "coolGuy99"
        }
        const response = await chai.request('http://localhost:3001').put('/users/updateAccount').send(data);
        expect(response).to.have.status(200);
    });

    it('should return updated user details', async() => {
        let userEmail = 'burner@gmail.com';
        const response = await chai.request('http://localhost:3001').get('/users/findUser/' + userEmail);
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('uname','coolGuy99');
        expect(response.body).to.have.property('email','burner@gmail.com');
        expect(response.body).to.have.property('win_count',0);
        expect(response.body).to.not.have.property('password');

    });

    it('should not update with a bad email', async() => {
        let data = {
            username: "coolGuy99",
            email: "burner@gmail.com",
            newEmail: "notvalid"
        }
        const response = await chai.request('http://localhost:3001').put('/users/updateAccount').send(data);
        expect(response).to.have.status(400);
    });

    it('should not update with a bad password', async() => {
        let data = {
            username: "coolGuy99",
            email: "burner@gmail.com",
            newPassword: "short"
        }
        const response = await chai.request('http://localhost:3001').put('/users/updateAccount').send(data);
        expect(response).to.have.status(400);
    });

    it('should update an email and password at the same time', async() => {
        let data = {
            username: "coolGuy99",
            email: "burner@gmail.com",
            newEmail: "burnert@gmail.com",
            newPassword: "rigmarole"
        }
        const response = await chai.request('http://localhost:3001').put('/users/updateAccount').send(data);
        expect(response).to.have.status(200);
    });

    it('should update a username and email at the same time', async() => {
        let data = {
            username: "coolGuy99",
            email: "burnert@gmail.com",
            newUsername: "burner@gmail.com",
            newEmail: "burner@gmail.com"
        }
        const response = await chai.request('http://localhost:3001').put('/users/updateAccount').send(data);
        expect(response).to.have.status(200);
    });

    it('should update a username and password at the same time', async() => {
        let data = {
            username: "burner@gmail.com",
            email: "burner@gmail.com",
            newUsername: "coolGuy99",
            newPassword: "abulafia"
        }
        const response = await chai.request('http://localhost:3001').put('/users/updateAccount').send(data);
        expect(response).to.have.status(200);
    });

    it('should update a username, password, email at the same time', async() => {
        let data = {
            username: "coolGuy99",
            email: "burner@gmail.com",
            newUsername: "burner@gmail.com",
            newPassword: "throwaway",
            newEmail: "burnert@gmail.com"
        }
        const response = await chai.request('http://localhost:3001').put('/users/updateAccount').send(data);
        expect(response).to.have.status(200);
    });

    it('increments win count for a user', async() => {
        let data = {
            username: "burner@gmail.com"
        }
        const response = await chai.request('http://localhost:3001').put('/users/updateWinCount').send(data);
        expect(response).to.have.status(200);

    });

    it('reflects the new win count', async() => {

        let userEmail = 'burnert@gmail.com';
        const response = await chai.request('http://localhost:3001').get('/users/findUser/' + userEmail);
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('win_count',1);
        expect(response.body).to.not.have.property('password');

    });

    it('should delete a user', async() => {

        let data = {
                    username: "burner@gmail.com",
                    email: "burnert@gmail.com",
                };

        const response = await chai.request('http://localhost:3001').delete('/users/delete').send(data);
        expect(response).to.have.status(200);

    });

    it('reflects the original record size after deleting a user', async() =>{
        const response = await chai.request('http://localhost:3001').get('/users/fetchUsers');
        expect(response).to.have.status(200);
        expect(response.body.length).to.be.equal(3);
    });

    it('does not find the deleted user', async() =>{
        let userEmail = 'burner@gmail.com';
        const response = await chai.request('http://localhost:3001').get('/users/findUser/' + userEmail);
        expect(response).to.have.status(204);
    });

    it('returns an error if a nonexistent user is deleted', async() => {

        let data = {
                    username: "coolGuy99",
                    email: "burner@gmail.com",
                };

        const response = await chai.request('http://localhost:3001').delete('/users/delete').send(data);
        expect(response).to.have.status(400);

    });

    it('should return all achievements', async() => {

        let data = {
            email: "burner@gmail.com",
            password: "sufficient"
        }
        const response = await chai.request('http://localhost:3001').get('/ach/fetchAchievements');
        expect(response).to.have.status(200);
        expect(response.body.length).to.be.equal(2);
        expect(response.body[0]).to.have.property('id',3);
        expect(response.body[0]).to.have.property('aname','5 in a row');
        expect(response.body[0]).to.have.property('description','Defeat 5 opponents in the same session');
    });

    it('should return specific achievement by id', async() => {

        let id = '3';
        const response = await chai.request('http://localhost:3001').get('/ach/findAchievement/' + id);
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('id',3);
        expect(response.body).to.have.property('aname','5 in a row');
        expect(response.body).to.have.property('description','Defeat 5 opponents in the same session');
        
    });

    it('should not find an achievement that is not in the database', async() => {

        let id = '6';
        const response = await chai.request('http://localhost:3001').get('/ach/findAchievement/' + id);
        expect(response).to.have.status(400);
        
    });

    it('should return a specific user\'s achievements', async() => {

        let email = 'bbird@gmail.com'
        const response = await chai.request('http://localhost:3001').get('/uha/fetchUserAch/' + email);
        expect(response).to.have.status(200);
        expect(response.body.length).to.be.equal(1);
        expect(response.body[0]).to.have.property('user_id',42);
        expect(response.body[0]).to.have.property('aid',3);
        expect(response.body[0]).to.have.property('a_date','2024-03-23T01:22:33.935Z');
        
        
    });

    it('should not return data for a nonexistent user', async() => {

        let email = 'notreal@gmail.com'
        const response = await chai.request('http://localhost:3001').get('/uha/fetchUserAch/' + email);
        expect(response).to.have.status(400);
        
        
    });

    it('should add a user achievement', async() => {
        let data = {
            email: "cmonster@gmail.com",
            achievementName: 4
        }
        const response = await chai.request('http://localhost:3001').post('/uha/addUserAch/').send(data);
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message','Achievement added to user');
        expect(response.body).to.have.property('status', true);
        expect(response.body).to.have.property('user',43);
        expect(response.body).to.have.property('achievement',4);
        
        
    });

    it('should not add nonexistent achievementid', async() => {
        let data = {
            email: "cmonster@gmail.com",
            achievementName: 1
        }
        const response = await chai.request('http://localhost:3001').post('/uha/addUserAch/').send(data);
        expect(response).to.have.status(400);
        
        
    });

    it('should calculate achievement percentages', async() => {
        const response = await chai.request('http://localhost:3001').get('/ach/fetchPercentAchieved')
        expect(response).to.have.status(200);
        console.log(response.body);
        expect(response.body[0]).to.have.property('pct','66.7');
        expect(response.body[0]).to.have.property('id',3);
        expect(response.body[1]).to.have.property('pct','33.3');
        expect(response.body[1]).to.have.property('id',4);
        expect(response.body.length).to.be.equal(2);
    })

    it('cleans up', async() => {
        let data = {
            email: "cmonster@gmail.com",
            achievementName: 4
        }
        const response = await chai.request('http://localhost:3001').delete('/uha/delUserAch/').send(data);
        expect(response).to.have.status(200);
        
        
        
    });

    

});