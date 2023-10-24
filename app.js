require('dotenv').config()
const express = require('express')
const { mongoDbConnection } = require('./config')
const userRoute = require('./routes/userRoute')
const { blogModel } = require('./model/blog')
const appError = require('./utils/errorhandler')
const authController = require('./controller/authController')

const blogRoute = require('./routes/blogRoutes')


const PORT = process.env.PORT

// connection
const app = express()
mongoDbConnection()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', userRoute)
app.use('/api/v1', blogRoute)




app.listen(PORT, () => {
    console.log('this is server is up and running')
})