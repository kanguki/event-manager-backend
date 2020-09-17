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
                        user_id, event_id,
                    })
                    
                    await registration
                        .populate('user_id','-password')    //print all info of user except password
                        .populate('event_id')
                        .execPopulate()
                    
                    registration.email = registration.user_id.email
                    registration.owner = registration.event_id.user_id
                    registration.event_title = registration.event_id.title
                    registration.event_image = registration.event_id.thumbnail_url
                    registration.date = registration.event_id.date
                    registration.save()

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
    checkIfUserHasRegistered: (req, res) => {
        jwt.verify(req.token, 'secret', async (err, payloadData) => {
            if (err) {
                return res.sendStatus(401)
            } else{
                const {event_id} = req.params
                const result = await Registration.findOne({$and: [{user_id: payloadData.user._id},{event_id: event_id}]})
                if (result) return res.json({status: true})
                else return res.json({status: false})
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
    },
    deleteRegistrationById: (req, res) => {
        jwt.verify(req.token, 'secret', async (err, payloadData) => {
            if (err) return res.status(401)
            
            const { registration_id } = req.params
            try {
                await Registration.findByIdAndDelete(registration_id) 
                return res.json({message: 'success'})
            } catch (error) {
                return res.status(400).send(`Oops! We couldn't find any registrations to delete`)
            }
        })
    },
        getRequestsNotYetChecked: (req, res) => {
            jwt.verify(req.token, 'secret', async (err, payloadData) => {
    
                if (err) return res.status(400).send(`We can't find any data that matches your request`)
    
                const owner_id = payloadData.user._id
                const results = await Registration.find( { owner: owner_id })
                const r = results.filter(r => !r.approved) 
                return res.json(r) 
            })
        },
        getAllRequests: (req, res) => {
            jwt.verify(req.token, 'secret', async (err, payloadData) => {
                if (err) res.sendStatus(401)
                const owner_id = payloadData.user._id
                const results = await Registration.find( { owner: owner_id })
                return res.json(results) 
            })
        },
        getMySubscriptions: (req, res) => {
            jwt.verify(req.token, 'secret', async (err, payloadData) => {
                if (err) return res.status(400).send(`Can't get any of your registrations`)
                
                const subscriber_id  = payloadData.user._id
                const registration = await Registration.find({ user_id: subscriber_id })
                 //await registration.populate('event_id').populate('user_id').execPopulate()
                
                 if (registration) return res.json(registration)
                else return res.status(404).json(`You haven't joined any events yet...`)

            })
    },
        getAllRegistrationsOfAnEvent: (req, res) => {
            jwt.verify(req.token, 'secret', async (err, payloadData) => {
                if (err) return res.status(401).json('Unauthorized')
                const {event_id} = req.params
                const registrations = await Registration.find({ event_id })
                return res.json(registrations)
                })
            }
}
//for front end purpose, POPULATE method helps us goes deeply into user and event
//tables and print out all information about the specific users/events

