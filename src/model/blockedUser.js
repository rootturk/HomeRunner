const mongoose = require('mongoose')

const blockedUserSchema = new mongoose.Schema({
    username: {type:String, default:null},
    blocked_username: {type:String, default:null},
    created: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('blockedUser', blockedUserSchema)