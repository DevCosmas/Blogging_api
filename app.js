require('dotenv').config()
const express = require('express')
const { mongoDbConnection } = require('./config')
const userController = require('./controller/userController')
const userRoute = require('./routes/userRoute')
const blogRoute = require('./routes/blogRoutes')
const errorHandler = require('./controller/errorHandler')
const appError = require('./utils/errorhandler')


const PORT = process.env.PORT

// connection
const app = express()
mongoDbConnection()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//express middleware really dealt with me here. this is the only possible solution i have for now
app.post("/api/v1/signUp", userController.signUp)
app.post("/api/v1/login", userController.Login)
app.post("/api/v1/logout", userController.logout)
app.post("/api/v1/activateAcct", userController.reactivateAcct)


app.use('/api/v1', blogRoute)
app.use('/api/v1', userRoute)




app.all('*', (req, res, next) => {
    next(new appError('page not found', 404))
});

app.use(errorHandler)
app.listen(PORT, () => {
    console.log('this is server is up and running')
})