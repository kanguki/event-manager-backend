const express = require('express')
const multer = require('multer')

const UserController = require('./controllers/UserController')
const EventController = require('./controllers/EventController')
const EventDashboard = require('./controllers/EventDashboard')
const LoginController = require('./controllers/LoginController')
const uploadConfig = require('./config/upload')
const RegistrationController = require('./controllers/RegistrationController')
const TrackRegistration = require('./controllers/TrackRegistration')

const routes = express.Router()
const upload = multer(uploadConfig)

routes.get('/status', (req, res) => {
    res.send({status: 200})
})



//TODO: registration Approval cotroller
//TODO: registration Rejection controller





//Registration
routes.post('/registration/add/:event_id',RegistrationController.addNewRegistration)
routes.get('/registration/:registration_id', RegistrationController.getRegistrationById)
routes.post('/registration/:registration_id/approve', TrackRegistration.approval)
routes.post('/registration/:registration_id/reject', TrackRegistration.rejection)



//login
routes.post('/sign-in',LoginController.authenticate)

//Dashboard
routes.get('/dashboard/:activity', EventDashboard.getEventsThatHasActivityXXX)
routes.get('/dashboard', EventDashboard.getAllEvents)
routes.get('/events/:eventId', EventDashboard.getEventById)

//Event
routes.post('/events/add', upload.single("thumbnail"), EventController.addNewEvent)
routes.delete('/events/remove/:eventId',EventController.deleteEventById)


//User
routes.post('/sign-up', UserController.addNewUser)
routes.get('/users/:userId', UserController.getUserById)
routes.get('/users', UserController.getAllUsers)


module.exports = routes