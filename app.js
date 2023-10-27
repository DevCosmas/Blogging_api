require('dotenv').config()
const express = require('express')
const { mongoDbConnection } = require('./config')
const userRoute = require('./routes/userRoute')
// const reviewRoute= require('./routes/reviewsRoutes')
const blogRoute = require('./routes/blogRoutes')


const PORT = process.env.PORT

// connection
const app = express()
mongoDbConnection()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use('/api/v1', reviewRoute)
app.use('/api/v1', blogRoute)
app.use('/api/v1', userRoute)





app.listen(PORT, () => {
    console.log('this is server is up and running')
})