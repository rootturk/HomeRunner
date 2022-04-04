const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender_username: {type:String, default:null},
    receiver_username: {type:String, default:null},
    created: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('message', messageSchema)