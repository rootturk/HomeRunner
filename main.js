require("dotenv").config()
require('./config/database').connect()

const winston = require('winston');

const logConfiguration = {
    'transports': [
        new winston.transports.File({
            level: 'error',
            filename: 'logs/example.log'
        })
    ], format: winston.format.combine(
        winston.format.label({
            label: 'Label🏷️'
        }),
        winston.format.timestamp({
           format: 'MMM-DD-YYYY HH:mm:ss'
       }),
        winston.format.printf(info => `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`),
    )
};

const logger = winston.createLogger(logConfiguration);

logger.error("Application Started!");

const express = require('express')
const http = require('http')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const auth = require('./middleware/auth')
const app = express()
const {port } = process.env;
const server = http.createServer(app);
//const cors = require('cors')
const bodyParser = require('body-parser');
const User = require('./model/user');
const Activity = require('./model/activity');

//app.use(cors)

app.use(express.json({limit: "50mb"}))

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())

app.get('/',(req, res)=> {
    res.send('Welcome to the Jungle')
})

server.listen(port, ()=> {
    console.log('Server running on port ${port}')
})

app.post("/user/register", async (req, res) =>{
 try{
    const {
        name,
        username,
        email,
        password,
        age
    } = req.body;
    
    if(!(name, email, password, age, email)){
        res.status(400).send("All Input is required..")
    }

    const user = await User.findOne({email});

    if(user){
        return res.status(409).send("Email Already Exist, Please Login")
    }

    encrytptedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
        name:name,
        username:username,
        email: email.toLowerCase(),
        password: encrytptedPassword,
        age: age
    })

    const token = jwt.sign(
    {
        user_id: newUser._id, email},
        process.env.TOKEN_KEY,{
            expiresIn:"5h"
        }
    )

    newUser.token = token;

    res.status(201).json(newUser)

 }catch(err){
console.log(err)
 }
})


app.post("/user/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "5h",
          }
        );
  
        // save user token
        user.token = token;

        await Activity.create({
            username:user.username,
            activity_type:1,
            ip_address: req.ip
        })

        let response = {
            data : user,
            msg :'Success',
            code :200
        }
  
        // user
        res.status(200).json(response);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });

app.get('/welcome', auth, (req, res)=>{
    res.status(200).send('Welcome to the Auth Jungle')
})


app.listen(port, ()=> console.log('Home RUN'))

module.exports = app