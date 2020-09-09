const Event = require('../models/Event')
const User = require('../models/User')

module.exports = EventController = {
    addNewEvent: async (req, res) => {
        const { title, description, price, activity,date } = req.body
        const { user_id } = req.headers
        const { filename  } = req.file
        try {
            const user = await User.findById(user_id)    
        } catch (error) {
            return res.status(404).json({ message: `User does not exist` })
        }
        try {
            const event = await Event.create({
                title, description, user_id, activity, date,
                price: parseFloat(price),   //parse item named price that we passed in req.body 
                thumbnail: filename ,
            })
            return res.json(event)
        } catch (error) {
            return res.status(400).json({ message: `Oops!Can't create new event...` })
        }

    },
    deleteEventById: async (req, res) => {
        const { eventId } = req.params
        try {
            await Event.findByIdAndDelete(eventId)
            return res.status(204).send(`Successfully delete event ${eventId}`)
        } catch (error) {
            return res.status(400).send(`We can't find event that you're looking for. It may be removed before...` )
        }
    }

}