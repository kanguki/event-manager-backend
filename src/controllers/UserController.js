const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = UserController = {
    addNewUser: async (req, res) => {
        try {            
            //destruct from req.body
            const { firstName, lastName, email, password } = req.body
            const existedUser = await User.findOne({email})
            if (!existedUser) {
                //hash password to give to the new created user
                const hashedPassword = await bcrypt.hash(password, 10)

                const user =await User.create({
                    firstName,lastName,email,
                    password: hashedPassword
                })    
                return res.json({
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                })                
            }

            return res.status(400).json({
                message: 'email/user already exist!'
            })

        } catch (err) {
            throw Error(`Error while registering a new user : ${err}`)
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find({})
            return res.json(users)
        } catch (error) {
            return res.status(404).json(`We are sorry, we cannot find any users at the moment`)
        }
        
    },
    getUserById: async (req, res) => {
        const { userId } = req.params
        try {
            const user =await User.findById(userId)
            return res.json(user)
        } catch (err) {
            return res.status(400).json({
                message: `Oops, user not found... `
            })
        }
    }

}