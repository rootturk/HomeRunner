const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
    username: {type:String, default:null},
    activity_type:{type:Number, default:null},
    ip_address: {type:String, default:null},
    created: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('activity', activitySchema)