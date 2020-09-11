const { JsonWebTokenError } = require('jsonwebtoken')
const Event = require('../models/Event')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

module.exports = EventController = {
    addNewEvent:  (req, res) => {
        jwt.verify(req.token, 'secret', async (err, payloadData) => {
            if (err) {
                res.sendStatus(401)
            }else {               
                const { title, description, price, activity, date } = req.body 
                const { filename  } = req.file               
                try {
                    const event = await Event.create({
                        title, description, activity, date,
                        price: parseFloat(price),   //parse item named price that we passed in req.body 
                        thumbnail: filename,
                        user_id: payloadData.user._id
                    })
                    return res.json(event)
                } catch (error) {
                    return res.status(400).json({ message: `Oops!Can't create new event...` })
                }
            }
        })

    },
    deleteEventById: (req, res) => {
        const { eventId } = req.params
        jwt.verify(req.token, 'secret', async (err, payloadData) => {
            if (err) {
                return res.sendStatus(401)
            } else {
                try {
                    await Event.findByIdAndDelete(eventId)
                    return res.status(204).send(`Successfully delete event ${eventId}`)
                } catch (error) {
                    return res.status(400).send(`We can't find event that you're looking for. It may be removed before...` )
                }
            }
        })
    }

}
                //when creating a new event in client side, we pass in headers, now we can grab it
                //eg1: await api.post('/events/add', eventData, { headers: { user_id } })
                //eg2: await api.get('/events/muEvents',{header: {user_id}})
                //const { user_id } = req.headers
                // try {
                //     const user = await User.findById(payloadData.user._id)    
                // } catch (error) {
                //     return res.status(404).json({ message: `User does not exist, please login` })
                // }
                //WE DON'T NEED USER_ID TO AUTHORIZE NOW BECAUSE WE USE JWT