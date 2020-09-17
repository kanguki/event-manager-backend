const Registration = require('../models/Registration')
const Event = require('../models/Event')

module.exports = ApproveRegistration = {
    approval: async (req, res) => {
        const { registration_id } = req.params
        try {
            const registration = await Registration.findById(registration_id) 
    
            registration.approved = true
    
            await registration.save()
    
            return res.json(registration)
            
        } catch (error) {
            return res.status(400).json(error)
        }
    },
    rejection: async (req, res) => {
        const { registration_id } = req.params
        try {
            const registration = await Registration.findById(registration_id) 
    
            registration.approved = false
    
            await registration.save()
    
            return res.json(registration)
            
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}