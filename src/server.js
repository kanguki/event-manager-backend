const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const routes = require('./routes')

const PORT = process.env.PORT || 8000

const app = express()
const server = http.Server(app) //this server is a server that uses http protocol
const io = socketio(server) //io(socket) has to serve a server

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config() 
}

//config mongodb
try {
    mongoose.connect(process.env.MONGO_DB_CONNECTION, {
        useNewUrlParser : true,
        useUnifiedTopology: true,  
        useFindAndModify: false,
        useCreateIndex: true
    })
    
} catch (err) {
    console.log(err)
}

const connectedUsers = {}
io.on('connection', socket => {
    const {user} = socket.handshake.query
    
    connectedUsers[user] = socket.id    //this is not an array, this is set property user(string)
                                    //of connectedUser as socket.id (id of the socket connected)
                                //this tells which user is connected to which socket(connection)
    
})

//this is a middleware as what we did with verifyTokens
app.use((req, res, next) => {
    req.io = io
    req.connectedUsers = connectedUsers
    next()
})
app.use(cors())
//return a middleware passing json as a response
app.use(express.json())
//serve files to client
app.use('/files', express.static(path.resolve(__dirname, "..", "files")))
app.use(routes)


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

//when we send data in body in type application/json in postman we have to set header 
//to contain content-type: application/json