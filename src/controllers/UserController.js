const User = require('../models/User')
const Event = require('../models/Event')
const Registration = require('../models/Registration')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
require('dotenv').config()

module.exports = UserController = {
    addNewUser: async (req, res) => {       
        try {                        
            //destruct from req.body
            const { firstName, lastName, email, password } = req.body
            const existedUser = await User.findOne({email})
            if (!existedUser ) {
                //hash password to give to the new created user
                const hashedPassword = await bcrypt.hash(password, 10)

                const user =await User.create({
                    firstName,lastName,email,
                    password: hashedPassword
                })    
                
                jwt.sign({ user: user._id }, 'secret', { expiresIn: '2d' }, async (err, payloadData) => {
                    const url = `https://eman-event-manager.herokuapp.com/confirm-email-success/${payloadData}`
                    let transporter = nodemailer.createTransport({
                        service: "Gmail",
                        auth: {
                            user: process.env.GMAIL_USER, // generated ethereal user
                            pass: process.env.GMAIL_PASSWORD, // generated ethereal password
                        },
                    });
                    await transporter.sendMail({
                        from: '"Kang Uki" <kanguki2381@gmail.com>', // sender address
                        to: email, // list of receivers
                        subject: "Event manager", // Subject line
                        text: "Confirmation", // plain text body
                        html: `<h1>Hi ${firstName} ${lastName}</h1> 
                        <p>Please click this link below to confirm your account</p>
                        <p><a href= "${url}">${url}</a></p>`
                    });
                })
                return res.json({
                    message: `Thank you for registering. 
                    Please close this tab and confirm your email then login`,
                    ok: true
                })
          
            } else {
                return res.json({
                    message: 'Email/User already exists! Do you want to login instead'
                })
            }

        } catch (err) {
            throw Error(`Error while registering a new user : ${err}`)
        }
    },
    getReconfirm: async (req, res) => {
        const { email } = req.body
        const userNotyetConfirmed = await User.findOne({ email })
        jwt.sign({ user: userNotyetConfirmed._id }, 'secret', async (err, payloadData) => {
            const url = `https://eman-event-manager.herokuapp.com/confirm-email-success/${payloadData}`
                    let transporter = nodemailer.createTransport({
                        service: "Gmail",
                        auth: {
                            user: process.env.GMAIL_USER, // generated ethereal user
                            pass: process.env.GMAIL_PASSWORD, // generated ethereal password
                        },
                    });
                    await transporter.sendMail({
                        from: '"Kang Uki" <kanguki2381@gmail.com>', // sender address
                        to: email, // list of receivers
                        subject: "Event manager", // Subject line
                        text: "Confirmation", // plain text body
                        html: `<h1>Hi ${firstName} ${lastName}</h1> 
                        <p>Please click this link below to confirm your account</p>
                        <p><a href= "${url}">${url}</a></p>`
                    });
        })
        return res.json({
            message: `We sent another link to your email. 
            Please close this tab and check your email...`})
    },
    confirm: async (req,res)=>{
        const { token } = req.params
        jwt.verify(token, 'secret', async (err, payloadData) => {
            const _id = payloadData.user
            const user = await User.findById(_id)
            if (user && !user.confirmed) {
                user.confirmed = true;
                await user.save();
                return jwt.sign({ user: user }, 'secret', (err, token) => {
                    return res.json({
                        token: token,
                        user_id: user._id
                    })
                })
            } else if (user && user.confirmed) {
                return res.json({message: `This account has already been confirmed`})
            }
            else {
                return res.status(404).json({message: `Can't find user`})
            }

        })
        
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find({})
            return res.json(users)
        } catch (error) {
            return res.status(404).json(`We are sorry, we cannot find any such users at the moment`)
        }
        
    },
    getUserById:  (req, res) => {
        jwt.verify(req.token, 'secret', async (err, payloadData) => {
            if (err) return res.status(401)
            
            const userId = payloadData.user._id
            try {
                const result = await User.findById(userId)
                const user = {
                    firstName : result.firstName,
                    lastName : result.lastName,
                    email : result.email,
                    _id: result.id,
                }
                return res.json(user)
            } catch (err) {
                return res.status(400).json({
                    message: `Oops, user not found... `
                })
            }
        })
    }, deleteUserById: (req, res) => {
        jwt.verify(req.token, 'secret', async (err, payloadData) => {
            if (err) return res.status(401)
            const user_id = payloadData.user._id
            try {
                await User.findByIdAndDelete(user_id)
                await Event.deleteMany({ user_id })
                await Registration.deleteMany({ user_id })
                await Registration.deleteMany({owner: user_id})
                return res.json(`Successfully deleted user!`)
            } catch (error) {
                return res.json(`Error delete user`)
            }
            
        })
    }

}