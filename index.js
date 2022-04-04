const http = require("http")
const app = require('./main')
const server = http.createServer(app)
const winston = require('winston');

const {API_PORT} = process.env
const port = process.env.PORT || API_PORT

server.listen(port, ()=>{
    console.log("Server Running on port ${port}")
})