const mongoose = require('mongoose')


const EventSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    activity: String,
    date: Date,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, {
        toJSON: {
        virtuals: true
    }
})
//this means, we temporarily give EventSchema.thumnail a new name: 'thumbnail_url'
//this virtual  name will not be saved into mongodb database, just for developing purpose
EventSchema.virtual('thumbnail_url').get(function () {
    return `http://localhost:8000/files/${this.thumbnail}`
});
module.exports = mongoose.model('Event', EventSchema)