const Event = require('../models/Event')
const User = require('../models/User')

module.exports = EventDashboard = {
    getAllEvents: async (req, res) => {
        try {
            const events = await Event.find({})
            if (events) {
                return res.json(events)
            }            
        } catch (error) {
            return res.status(404).json({ message: `There are not any events right now` })
        }
    },
    getEventByUserId: async (req, res) => {
        const { user_id } = req.headers
        try {
            const event = await Event.find({user_id})
            if (event) {
                return res.json(event)
            }            
        } catch (error) {
            return res.status(404).json({ message: `You haven't created any events yet` })
        }
    },
    getEventById: async (req, res) => {
        const { event_id } = req.params
        try {
            const event = await Event.findById(event_id)
            if (event) {
                return res.json(event)
            }            
        } catch (error) {
            return res.status(404).json({ message: `Something went wrong` })
        }
    },
    getEventsThatHasActivityXXX: async (req, res) => {
        const { activity } = req.params
        const query = { activity: activity } || {}  //here we can use ES6 syntax 
                                                    //to shorten query ={activity}
        try {
            //find all documents that has activity : activity
            const eventsThatHasActivityXXX = await Event.find(query)
            return res.json(eventsThatHasActivityXXX)
        } catch (error) {
            return res.status(404).send(`No events has activity ${activity}` )
        }
    },
}