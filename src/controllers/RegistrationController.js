const Registration = require('../models/Registration')

module.exports = RegistrationController = {
    addNewRegistration: async (req, res)=>{
        const { user_id } = req.headers
        const { event_id } = req.params
        const { date } = req.body

        const registration = await Registration.create({ date, user_id, event_id })
        
        await registration
            .populate('user_id','-password')    //print all info of user except password
            .populate('event_id')
            .execPopulate()
        return res.json(registration)
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

