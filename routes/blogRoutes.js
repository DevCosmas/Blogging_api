const express = require('express')
const blogController = require('./../controller/blogController')
const authController = require('./../controller/authController')
const reviewRoute = require('./../routes/reviewsRoutes')

const router = express.Router()

// ACCESSABLE BY BOTH LOGGED IN AND NON LOGGED IN USERS
router.get("/allBlog", blogController.allBlog)
router.get("/readBlog/:blogId", blogController.readBlog)


// router.use(authController.isAuthenticated)

// ONLY ACCESSABLE BY LOGGED IN USERS

router.post("/createblog", authController.isAuthenticated, blogController.createBlog)
router.get("/myBlog", authController.isAuthenticated, blogController.myBlog)
router.patch("/updateBlog/:blogId", authController.isAuthenticated, blogController.updateBlog)
router.delete("/deleteBlog/:blogId", authController.isAuthenticated, blogController.deleteBlog)
router.patch("/publishBlog/:blogId", authController.isAuthenticated, blogController.publishBlog)
router.use('/:blogId', authController.isAuthenticated, reviewRoute)


module.exports = router