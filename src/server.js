require("dotenv").config()
require('./config/database').connect()

const winston = require('winston');

const logConfiguration = {
    'transports': [
        new winston.transports.File({
            level: 'error',
            filename: 'logs/main.log'
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

logger.debug("HomeRunner is start")

const express = require('express')

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const bodyParser = require('body-parser');
const app = express()

//const cors = require('cors')
const auth = require('./middleware/auth')
const User = require('./model/user');
const Activity = require('./model/activity');
const BlockedUser = require('./model/blockedUser');
const Message = require("./model/message")
const activityEnums = require('./middleware/enum')

//app.use(cors)

app.use(express.json({ limit: "50mb" }))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Welcome to the API HomePage')
})

app.post("/api/user/register", async (req, res) => {
    try {
        const {
            name,
            username,
            email,
            password,
            age
        } = req.body;

        if (!(name, email, password, age, email, username)) {
            let response = {
                msg: 'All Input is required..!',
                status: 409
            }

            res.status(409).json(response)
        }

        const user = await User.findOne({ email }) || await User.findOne({ username });

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
            msg: 'Succeeded',
            status: 201,
            data: {
                id:newUser._id
            }
        }
 
        res.status(201).json(response)

    } catch (err) {
        console.log(err)
        logger.error(err)
    }
})

app.post("/api/user/login", async (req, res) => {
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

app.post("/api/user/block", auth, async (req, res) => {
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

        const user = await BlockedUser.findOne({ username: payload.username, blocked_username: username });
        console.log(user)
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
            username: payload.username,
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

app.delete("/api/user/block", auth, async (req, res) => {
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
            username: payload.username,
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

app.post("/api/message", auth, async (req, res) => {
    try {
        const { message, to } = req.body;

        var token = req.header('x-access-token');

        let payload = jwt.verify(token, process.env.TOKEN_KEY)

        const user = await BlockedUser.findOne({ username: payload.username, blocked_username: to })
         || await BlockedUser.findOne({ blocked_username: payload.username, username: to });
        
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
            msg: 'Message send succeeded.',
            status: 200
        }

        res.status(200).json(response);
    } catch (err) {
        logger.error(err)
        console.log(err)
    }
});

app.get("/api/message", auth, async (req, res) => {
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

app.get("/api/user/activity", auth, async (req, res) => {
    try {
        var token = req.header('x-access-token');

        let payload = jwt.verify(token, process.env.TOKEN_KEY)

        let activities = await Activity.find({
            username: payload.username,
        });

        await Activity.create({
            username: payload.username,
            activity_type: activityEnums["GETACTIVITIES"],
            ip_address: req.ip,
            description:"Take ALL Activities from API"
        })

        let response = {
            data:activities,
            msg: 'Succeeded.',
            status: 200
        }

        res.status(200).json(response);
    } catch (err) {
        logger.error(err)
        console.log(err)
    }
});


app.listen(process.env.API_PORT, () => console.log('Started APP Listen.'))

module.exports = {app}