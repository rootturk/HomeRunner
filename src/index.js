//const http = require("http")
const app = require('./main')
//const server = http.createServer(app)
const winston = require('winston');

const {API_PORT} = process.env
const port = process.env.PORT || API_PORT

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

//server.listen(port, ()=>{
//    console.log("Server Running on port ${port}")
//})

module.exports = {logger}