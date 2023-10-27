const { blogModel } = require('./../model/blog')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const appError = require('../utils/errorhandler')
const sendEmail = require('./../utils/email')
const blogSearch = require('./../utils/query')




const createBlog = async (req, res, next) => {

    try {
        if (req.user.active === true) {
            const blogPost = req.body
            blogPost.author = req.user.id
            const newBlog = await blogModel.create(blogPost)
            newBlog.readingTime = newBlog.calReadTime(blogPost.bodyContent)
            if (!newBlog) return next(new appError('this blog post was not created', 400))
            res.status(201).json({
                result: 'SUCCESS',
                message: "a new blog post has been created",
                newBlog
            })
        } else {
            return next(new appError('User does not exist kindly signUp', 404))
        }
    } catch (err) {
        next(new appError(err, 500))
    }
}

const allBlog = async (req, res, next) => {

    try {

        const findBlog = new blogSearch(req, res)
        const blogs = findBlog.search()
        if (!blogs || blogs.size === 0) {
            next(new appError('blog not found', 404))
        }

    } catch (err) {
        next(new appError(err, 500))
    }
}


const myBlog = (req, res, next) => {
    try {
        if (!req.user.active === true) return next(new appError('User does not exist kindly signUp', 404))
        const findBlog = new blogSearch(req, res)
        const blogs = findBlog.myBlog()
        if (!blogs || blogs.size === 0) {
            next(new appError('blog not found', 404))
        }

    } catch (err) {
        next(new appError(err, 500))
    }

}

const updateBlog = async (req, res, next) => {


   
    

    try {
        if (!req.user.active === true) return next(new appError('You are not authorized. Kindly sign up or login'));
        const blog = await blogModel.findById(req.params.blogId);
        if (!blog) return next(new appError('this blog is not found', 404))

        if (blog.author.id === req.user.id) {
            const { title, description, bodyContent, tags } = req.body;
            const updates = {};

            if (title) {
                updates.title = title;
            }
            if (description) {
                updates.description = description;
            }
            if (bodyContent) {
                updates.bodyContent = bodyContent;
            }
            if (tags) {
                updates.tags = tags;
            }

            const updatedBlog = await blogModel.updateOne({ _id: req.params.blogId }, updates);

            res.status(200).json({
                result: 'SUCCESS',
                message: 'Blog updated successfully',
                updatedBlog
            });
        } else {
            next(new appError('You are not authorized to update this blog', 403));
        }
    } catch (err) {
        next(new appError(err, 500));
    }

}


const deleteBlog = async (req, res, next) => {
    if(!req.user.active === true) return next(new appError('You are not authorized. Kindly sign up or login'));

    const blog = await blogModel.findById(req.params.blogId)
    if (!blog) return next(new appError('this blog is not found', 404))
    if (blog.author.id === req.user.id) {
        const deletedBlog = await blogModel.deleteOne({ _id: req.params.blogId });
        res.status(203).json({
            result: 'SUCCESS',
            message: 'Blog has been deleted successfully',
            deletedBlog
        });
    } else {
        next(new appError('You are not authorized to delete this blog', 403));
    }
}

const publishBlog = async (req, res, next) => {
    
    try {
        if (!req.user.active === true) return next(new appError('You are not authorized. Kindly sign up or login'))
        const blog = await blogModel.findById(req.params.blogId)
        if (!blog) return next(new appError('this blog is not found', 404))
        if (blog.author.id === req.user.id) {
            blog.state = "published"
            blog.save()
            res.status(200).json({
                result: 'SUCCESS',
                message: 'Blog has been published successfully',
                blog
            })
        } else {
            next(new appError('You are not authorized to publish this blog', 403));
        }
    } catch (err) {
        next(new appError(err, 500));
    }
}

const readBlog = async (req, res, next) => {

    try {
        const blog = await blogModel.findById(req.params.blogId).populate('reviews')
        if (!blog) return next(new appError('this blog is not found', 404))
        else {
            blog.readCount = (blog.readCount || 0) + 1;
            await blog.save()
            res.status(200).json({
                result: 'SUCCESS',
                message: 'Thank you for reading the article',
                blog
            })
        }
    } catch (err) {
        next(new appError(err, 500));
    }
}

module.exports = {
    createBlog,
    allBlog,
    myBlog,
    updateBlog,
    deleteBlog,
    publishBlog,
    readBlog
}