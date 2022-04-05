let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let app = require('../server').app;

chai.use(chaiHttp);

describe('Send New Message', () => {
    /*
    * Test the Message api
    */
        describe('api/message --> get all messages', () => {
            it('it should take messages if token is past!', (done) => {
                let user = {
                    "email": "akin@homerunner.com",
                    "password": "dockerize",
                }
                let token = ''
                chai.request(app)
                    .post('/api/user/login')
                    .send(user)
                    .end((err, res) => {
                        res.body.should.be.a('object');
                        res.body.should.have.property('data');
                        res.body.should.have.property('code');
                        res.should.have.status(200)
                        token = res.body.data
              
                        chai.request(app)
                        .get('/api/message')
                        .set("x-access-token", token)
                        .end((err, res)=> {
                    
                            res.should.have.status(200)  
                            done();
                        });
                    })
            });
        });

    /*
    * Test the Message api
    */
    describe('api/message --> get all messages', () => {
        it('it should take messages if token is past!', (done) => {
            let user = {
                "email": "akin@homerunner.com",
                "password": "dockerize",
            }
            let token = ''

            chai.request(app)
                .post('/api/user/login')
                .send(user)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('code');
                    res.should.have.status(200)
                    token = res.body.data

                    let message = {
                        'to': "rootturk",
                        'message':'Merhabalar nasilsinizzzz?'
                    }

                    chai.request(app)
                    .post('/api/message')
                    .send(message)
                    .set("x-access-token", token)
                    .end((err, res)=> {
                        res.should.have.status(200)  
                        done();
                    });
                })
        });
    });
});