const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {type:String, default:null},
    email: {type: String, default:null},
    password:{ type: String},
    updated: { type: Date, default: Date.now() },
    created: { type: Date, default: Date.now() },
    age: { type: Number, min: 18, max: 65, required: true },
    user_type:{type:Number},
    token: {type: String}
})

module.exports = mongoose.model('user', userSchema)