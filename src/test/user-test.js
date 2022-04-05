let chai = require('chai');
let app = require('../server').app;
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('New User register', () => {
    /*
    * Test the User api
    */
    describe('Succeeded User Register', () => {
        it('it should POST', (done) => {
            let user = {
                "email": "akin@homerunner.com",
                "username":"homerun",
                "password": "dockerize",
                "name": "AKIN ABDULLAHOGLU",
                "age": 29
            }
            chai.request(app)
                .post('/api/user/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201)
                    done();
                });
        });
    });
});

describe('New User register', () => {
    /*
    * Test the User api
    */
    describe('/POST user/login', () => {
        it('it should LOGIN, GET TOKEN', (done) => {
            let user = {
                "email": "akin@homerunner.com",
                "password": "dockerize",
            }
       
            chai.request(app)
                .post('/api/user/login')
                .send(user)
                .end((err, res) => {
                
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('code');
                    res.should.have.status(200)
                    done()
                })
        });
    });

    /*
    * Test the User api
    */
        describe('api/user/activity', () => {
            it('it should take activities if token is past!', (done) => {
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
                        .get('/api/user/activity')
                        .set("x-access-token", token)
                        .end((err, res)=> {
                
                            res.should.have.status(200)  
                            done();
                        });
                    })
            });
        });

});

describe('Wrong Login', () => {
    /*
    * Test the User api
    */
    describe('/POST user/login', () => {
        it('it should show Http 400', (done) => {
            let user = {
                "email": "akin2@homerunner.com",
                "password": "dockerize",
            }
       
            chai.request(app)
                .post('/api/user/login')
                .send(user)
                .end((err, res) => {
                    res.body.should.have.property('msg');
                    res.should.have.status(400)
                    done()
                })
        });
    });

    /*
    * Test the User api
    */
        describe('api/user/activity without token', () => {
            it('Want to take activities without token', (done) => {
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
                        .get('/api/user/activity')
                        //.set("x-access-token", token)
                        .end((err, res)=> {           
                            res.should.have.status(403)  
                            done();
                        });
                    })
            });
        });

});