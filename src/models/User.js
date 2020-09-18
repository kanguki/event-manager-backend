const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName: String, 
    lastName: String,
    email: String,
    password: String,
    // confirmed: {
    //     type: Boolean,
    //     defaultValue: false
    // }
})

module.exports = mongoose.model('User',UserSchema)