require("dotenv").config()
require('./config/database').connect()
const activityEnums = require('./middleware/enum')
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
const express = require('express')
const http = require('http')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const auth = require('./middleware/auth')
const app = express()
const { port } = process.env;
const server = http.createServer(app);
//const cors = require('cors')
const bodyParser = require('body-parser');
const User = require('./model/user');
const Activity = require('./model/activity');
const BlockedUser = require('./model/blockedUser');
const Message = require("./model/message")

//app.use(cors)

app.use(express.json({ limit: "50mb" }))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Welcome to the Jungle')
})

server.listen(port, () => {
    console.log('Server running on port ${port}')
})

app.post("/user/register", async (req, res) => {
    try {
        const {
            name,
            username,
            email,
            password,
            age
        } = req.body;

        if (!(name, email, password, age, email)) {
            let response = {
                msg: 'All Input is required..!',
                status: 409
            }

            res.status(409).json(response)
        }

        const user = await User.findOne({ email });

        if (user) {
            let response = {
                msg: 'Email Already Exist, Please Login!',
                status: 409,
            }

            return res.status(409).json(response)
        }

        encrytptedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name: name,
            username: username,
            email: email.toLowerCase(),
            password: encrytptedPassword,
            age: age
        })

        let response = {
            msg: 'All input is required!',
            status: 201,
            data: newUser
        }

        res.status(201).json(response)

    } catch (err) {
        console.log(err)
        logger.error(err)
    }
})

app.post("/user/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            let response = {
                msg: 'All input is required!',
                status: 400
            }

            res.status(400).json(response);
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user._id, email, username: user.username },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "5h",
                }
            );

            user.token = token;

            await Activity.create({
                username: user.username,
                activity_type: activityEnums.LOGIN,
                ip_address: req.ip
            })

            let response = {
                data: token,
                msg: 'Success',
                code: 200
            }

            res.status(200).json(response);
        }

        let response = {
            msg: 'Invalid Credentials',
            code: 400
        }

        res.status(400).json(response)
    } catch (err) {
        logger.error(err)
        console.log(err)
    }
});

app.post("/user/block", auth, async (req, res) => {
    try {
        const { username } = req.body;

        var token = req.header('x-access-token');

        let payload = jwt.verify(token, process.env.TOKEN_KEY)

        if (!(username)) {
            let response = {
                msg: 'Username is required!',
                status: 400
            }

            res.status(400).json(response);
        }

        const user = await User.findOne({ username: payload.username, blocked_username: username });

        if (user != null) {
            let response = {
                msg: 'Already this user is blocked!',
                status: 409
            }

            res.status(409).json(response);
        }

        await BlockedUser.create({
            username: payload.username,
            blocked_username: username
        })

        await Activity.create({
            username: user.username,
            activity_type: activityEnums["BLOCK USER"],
            ip_address: req.ip,
            description: username + " Block Status'}"
        })

        let response = {
            msg: 'Succeeded',
            status: 200
        }

        res.status(200).json(response);

    } catch (err) {
        logger.error(err)
        console.log(err)
    }
});

app.delete("/user/block", auth, async (req, res) => {
    try {
        const { username } = req.body;

        var token = req.header('x-access-token');

        let payload = jwt.verify(token, process.env.TOKEN_KEY)

        if (!(username)) {
            let response = {
                msg: 'Username is required',
                status: 400
            }

            res.status(400).json(response);
        }

        await BlockedUser.deleteMany({ username: payload.username, blocked_username: username });

        await Activity.create({
            username: user.username,
            activity_type: activityEnums["REMOVEBLOCKUSER"],
            ip_address: req.ip,
            description: username + " Remove Block Status'}"
        })

        let response = {
            msg: 'User removed succeeded.',
            status: 200
        }

        res.status(200).json(response);
    } catch (err) {
        logger.error(err)
        console.log(err)
    }
});

app.post("/message", auth, async (req, res) => {
    try {
        const { message, to } = req.body;

        var token = req.header('x-access-token');

        let payload = jwt.verify(token, process.env.TOKEN_KEY)

        const user = await User.findOne({ username: payload.username, blocked_username: to })
         || await User.findOne({ blocked_username: payload.username, username: to });

        if (user != null) {
            let response = {
                msg: 'Message sending not possible because this user blocked or this user blocked you.',
                status: 409
            }

            res.status(409).json(response);
        }

        if (!(message)) {
            let response = {
                msg: 'Username is required',
                status: 400
            }

            res.status(400).json(response);
        }

        await Message.create({
            sender_username: payload.username,
            receiver_username: to, 
            message: message
        });

        await Activity.create({
            username: payload.username,
            activity_type: activityEnums["REMOVEBLOCKUSER"],
            ip_address: req.ip,
            description:" Send Message to: " + to
        })

        let response = {
            msg: 'User removed succeeded.',
            status: 200
        }

        res.status(200).json(response);
    } catch (err) {
        logger.error(err)
        console.log(err)
    }
});

app.get("/message", auth, async (req, res) => {
    try {
        var token = req.header('x-access-token');

        let payload = jwt.verify(token, process.env.TOKEN_KEY)

        let messageUsers = await Message.find({
            receiver_username: payload.username,
        }).distinct('sender_username');

        let messageArray = []

        for(let i = 0; i < messageUsers.length;i++){
            let messages = await Message.find({
                sender_username: messageUsers[i],
                receiver_username: payload.username
            });

            let user = {
                'from': messageUsers[i],
                "messages": []
            }

            for(let y = 0; y < messages.length;y++){
                user["messages"].push(messages[y])
            }
            
            messageArray.push(user)
        }

        await Activity.create({
            username: payload.username,
            activity_type: activityEnums["REMOVEBLOCKUSER"],
            ip_address: req.ip,
            description:" Get All Message: "
        })

        let response = {
            data:messageArray,
            msg: 'Succeeded.',
            status: 200
        }

        res.status(200).json(response);
    } catch (err) {
        logger.error(err)
        console.log(err)
    }
});

app.get('/welcome', auth, (req, res) => {
    res.status(200).send('Welcome to the Auth Jungle')
})

app.listen(port, () => console.log('Home RUN'))

module.exports = app