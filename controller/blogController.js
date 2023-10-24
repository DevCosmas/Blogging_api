const { blogModel } = require('./../model/blog')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const appError = require('../utils/errorhandler')
const sendEmail = require('./../utils/email')
const blogSearch = require('./../utils/query')




const createBlog = async (req, res, next) => {

    try {
        const blogPost = req.body
        blogPost.author = req.user.id
        const newBlog = await blogModel.create(blogPost)
        newBlog.readingTime = newBlog.calReadTime(blogPost.bodyContent)
        if (!newBlog) return next(new appError('this blog post was not created', 400))
        // newBlog.readingTime = newBlog.calReadTime(blogPost.bodyContent)
        res.status(201).json({ result: 'SUCCESS', message: "a new blog post has been created", newBlog })
    } catch (err) {
        next(new appError(err, 500))
    }
}



const updateBlog = (req, res, next) => {

}


const allBlog = async (req, res, next) => {
 
 try {
       
        const findBlog = new blogSearch(req, res)
        const blogs=findBlog.search()
        if(!blogs || blogs.size===0){
            next(new appError('blog not found', 404))
        }

    } catch (err) {
        next(new appError(err, 500))
    }
}



// }

const myBlog = (req, res, next) => {

}
const deleteBlog = (req, res, next) => {

}

module.exports = {
    createBlog,
    allBlog
}