const mongoose = require('mongoose')

//diplay an event that a user register to
const RegistrationSchema = new mongoose.Schema({
    owner: String,
    email: String,
    event_title: String,
    event_image: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    date: Date,
    approved: Boolean
})

module.exports = mongoose.model('Registration',RegistrationSchema)