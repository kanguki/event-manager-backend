const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const routes = require('./routes')
const app = express()
const PORT = process.env.PORT || 8000

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
app.use(cors())
//return a middleware that passes json as a response
app.use(express.json())

app.use('/files', express.static(path.resolve(__dirname, "..", "files")))

app.use(routes)


//below is how we can connect to the database and listen to a port
try {
    mongoose.connect(process.env.MONGO_DB_CONNECTION, {
        useNewUrlParser : true,
        useUnifiedTopology: true,  
        useFindAndModify: false,
        useCreateIndex: true
    })
    console.log('MongoDb connected')
} catch (err) {
    console.log(err)
}

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

//when we send data in body in type application/json in postman we have to set header 
//to contain content-type: application/json