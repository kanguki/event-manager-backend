const express = require('express')


const verifyToken = require('./config/verifytoken')

const UserController = require('./controllers/UserController')
const EventController = require('./controllers/EventController')
const EventDashboard = require('./controllers/EventDashboard')
const LoginController = require('./controllers/LoginController')
const RegistrationController = require('./controllers/RegistrationController')
const TrackRegistration = require('./controllers/TrackRegistration')

const routes = express.Router()
// const multer = require('multer')
// const uploadConfig = require('./config/upload')
// const upload = multer(uploadConfig)

routes.get('/status', (req, res) => {
    res.send({status: 200})
})



//Registration
routes.post('/registration/register/:event_id', verifyToken, RegistrationController.addNewRegistration)
routes.delete('/registration/remove/:registration_id',verifyToken, RegistrationController.deleteRegistrationById)
routes.get('/registration/:registration_id', RegistrationController.getRegistrationById)
routes.get('/registration/check/:event_id', verifyToken, RegistrationController.checkIfUserHasRegistered)
routes.get('/registration/my/registrations', verifyToken, RegistrationController.getMySubscriptions)
routes.get('/registration/manage/requests/all', verifyToken, RegistrationController.getAllRequests)
routes.get('/registration/manage/requests', verifyToken, RegistrationController.getRequestsNotYetChecked)
routes.get('/event/registrations/:event_id',verifyToken,RegistrationController.getAllRegistrationsOfAnEvent)
routes.post('/registration/:registration_id/approve', TrackRegistration.approval)



//login
routes.post('/login', LoginController.authenticate)
routes.post('/user/update',verifyToken,LoginController.updateUserInfo)

//Dashboard
routes.get('/dashboard/:activity', EventDashboard.getEventsThatHasActivityXXX)
routes.get('/dashboard',  EventDashboard.getAllEvents)
routes.get('/events/yourEvents', verifyToken, EventDashboard.getEventByUserId)
routes.get('/details/event/:event_id',  EventDashboard.getEventById)

//Event upload.single("thumbnail"),
routes.post('/events/add',verifyToken,  EventController.addNewEvent)
routes.delete('/events/remove/:eventId',verifyToken,EventController.deleteEventById)


//User
routes.post('/sign-up', UserController.addNewUser)
routes.get('/users/user/id',verifyToken, UserController.getUserById)
routes.get('/users', UserController.getAllUsers)
routes.delete('/user/my-account', verifyToken, UserController.deleteUserById)
// routes.get('/confirm-email-success/:token',UserController.confirm)
// routes.post('/reconfirm-email', UserController.getReconfirm)
module.exports = routes