const mongoose = require('mongoose')

//diplay an event that a user register to
const RegistrationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    date: ()=>Date.now(),
    approved: Boolean
})

module.exports = mongoose.model('Registration',RegistrationSchema)