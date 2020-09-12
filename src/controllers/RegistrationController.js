const Registration = require('../models/Registration')
const jwt = require('jsonwebtoken')

module.exports = RegistrationController = {
    addNewRegistration: (req, res) => {
        jwt.verify(req.token, 'secret', async (err, payloadData) => {
            if (err) res.sendStatus(401)
            else {
                const user_id = payloadData.user._id
                const { event_id } = req.params
               
                try {
                    const registration = await Registration.create({
                        user_id, event_id
                    })
                    
                    await registration
                        .populate('user_id','-password')    //print all info of user except password
                        .populate('event_id')
                        .execPopulate()
                    
                    const eventOwner = req.connectedUsers[registration.event_id.user_id]
                //if owner of event is online, the request will be sent to she/he immediately
                    if (eventOwner) {
                        req.io.to(eventOwner).emit('registration_request', registration);
                    }

                    return res.json(registration)
                } catch (error) {
                    return res.status(400).json({message: 'We are sorry, registration cannot be made'})
                }
            }
        })
    },
    getRegistrationById: async (req, res) => {
        const { registration_id } = req.params
        try {
            const registration = await Registration.findById(registration_id)

            return res.json(registration)
        } catch (error) {
            return res.status(400).send(`Oops! We couldn't find any registrations`)
        }
    }
}
//for front end purpose, POPULATE method helps us goes deeply into user and event
//tables and print out all information about the specific users/events

