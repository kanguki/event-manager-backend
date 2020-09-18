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
                return res.json( { message: `User not found. Do you want to sign up instead?`    })
            }

            //CHECK IF PASSWORD MATCHES EMAIL OR NOT
            if (user && await bcrypt.compare(password, user.password )) {
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
                // else if (!user.confirmed) {
                //     return res.json(
                //         {   message: `Please confirm your email`,
                //             wantToConfirm: true })
                // }
            
                //return res.json(loggedInUser)
            } 
            else {
                return res.json({message: ` Password is incorrect`})
            }
            
            
        } catch (error) {
            throw Error(`Error while signing in ${error}`)
        }
    },
    updateUserInfo: (req, res) => {
        jwt.verify(req.token, 'secret', async (err, payloadData) => {
            if (err) return res.sendStatus(401)
            const user = await User.findById(payloadData.user._id)
            const { firstName, lastName, password } = req.body
            if (password !== "") {
                const hashedPassword = await bcrypt.hash(password,10)
                user.password = hashedPassword
            }
            if (firstName !== "") user.firstName = firstName
            if (lastName !== "") user.lastName = lastName
            user.save()
            return res.json({message: 'Successfully update user!'})
        })
    }
}
//in ES6, {xyz: xyz} ==={xyz}