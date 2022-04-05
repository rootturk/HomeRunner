let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('USER', () => {
    /*
    * Test the /POST route
    */
    describe('/POST user', () => {
        it('it should POST', (done) => {
            let user = {
                "username": "robhotturk",
                "name": "AKIN ABDULLAHOGLU",
                "password": "dockerize",
                "email": "akin7hh2@akinabdullahoglu.com",
                "age": 24
            }
            chai.request("http://localhost:4002")
                .post('/user/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201)
                    done();
                });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST user', () => {
        it('it should Wrong Input', (done) => {
            let user = {
                "name": "AKIN ABDULLAHOGLU",
                "password": "dockerize",
                "age": 24
            }
            chai.request("http://localhost:4002")
                .post('/user/register')
                .send(user)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(409)
                    done();
                });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST user/login', () => {
        it('it should LOGIN, GET TOKEN', (done) => {
            let user = {
                "email": "akin@akinabdullahoglu.com",
                "password": "dockerize",
            }
            let token = ''
            chai.request("http://localhost:4002")
                .post('/user/login')
                .send(user)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('code');
                    res.should.have.status(200)
                    token = res.body.data
                    console.log(token)
                    chai.request('http://localhost:4002')
                    .get('/welcome')
                    .set("x-access-token", token)
                    .end((err, res)=> {
                        console.log(res)
                        res.should.have.status(200)  
                        done();
                    });
                })
        });
    });
});