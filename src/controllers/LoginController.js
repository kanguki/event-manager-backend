const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//we can do module.exports = {...} without the name LoginController
module.exports = LoginController = {
    authenticate: async (req, res) => {
        try {
            const { email, password } = req.body
            //CHECK FIELD MISSING
            if (!email || !password) {
                return res.status(400).json({message:`Required field missing`})
            }

            //CHECK IF USER IS AVAILABLE
            const user = await User.findOne({ email }) //===find({email: email})
            if (!user) {
                return res.status(200).json(
                    { message: `User not found. Do you want to register instead?` })
            }
            //CHECK IF PASSWORD MATCHES EMAIL OR NOT
            if (user && await bcrypt.compare(password, user.password)) {
                const loggedInUser = {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
                //when signing, we make payloadData including information of user
                // in other words, token holds information of loggedInUser
                return jwt.sign({ user: loggedInUser }, 'secret', (err, token) => {
                    return res.json({
                        token: token,
                        user_id: loggedInUser._id
                    })
                })
                //return res.json(loggedInUser)
            } else {
                res.status(404).json({message: `Email / Password is invalid`})
            }
        } catch (error) {
            throw Error(`Error while signing in ${error}`)
        }
    }
}
//in ES6, {xyz: xyz} ==={xyz}