const Event = require('../models/Event')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

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
    getEventByUserId: (req, res) => {
        //when verifying, jwt parses req.token (get rid of headers(algorthm...) and signature
        //verify('secret'), now it only contain data of user, which is payloadData)
        //we can name payloadData or whatever, it's not constant
        jwt.verify(req.token, 'secret', async (err, payloadData) => {
            if (err) {
                res.sendStatus(401)
            }
            else {
                try {
                    //payloadData is not formed based on regular response, it's based on 
                    //when we logged in (jwt.sign(....))
                    //payloadData is kind of holding information of logged-in user
                    //as when logging in, we decode our data in token-body, and we
                    //can't change that pieces of data, so it's secured

                    const event = await Event.find({user_id: payloadData.user._id})
                    if (event) {
                        return res.json({event,payloadData})
                    }            
                } catch (error) {
                    return res.status(400).json({ message: `You haven't created any events yet` })
                }
            }
        })
        //
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