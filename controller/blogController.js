const { blogModel } = require('./../model/blog');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const appError = require('../utils/errorhandler');
const sendEmail = require('./../utils/email');
const blogSearch = require('./../utils/query');

const BlogHandlerFn = require('./../utils/blogClass');

const createBlog = async (req, res, next) => {
  const blogHandler = new BlogHandlerFn(req, res, next);
  const blog = blogHandler.createBlog();

};

const allBlog = async (req, res, next) => {
  try {
    const findBlog = new blogSearch(req, res);
    const blogs = findBlog.search();
    if (!blogs || blogs.size === 0) {
      next(new appError('blog not found', 404));
    }
  } catch (err) {
    next(new appError(err, 500));
  }
};

const myBlog = (req, res, next) => {
  try {
    if (!req.user.active === true)
      return next(new appError('User does not exist kindly signUp', 404));
    const findBlog = new blogSearch(req, res);
    const blogs = findBlog.myBlog();
    if (!blogs || blogs.size === 0) {
      next(new appError('blog not found', 404));
    }
  } catch (err) {
    next(new appError(err, 500));
  }
};

const updateBlog = async (req, res, next) => {
  const blogHandler = new BlogHandlerFn(req, res, next);
  const blog = blogHandler.updateBlog();
};

const deleteBlog = async (req, res, next) => {
  const blogHandler = new BlogHandlerFn(req, res, next);
  const blog = blogHandler.deleteBlog();
  
};

const publishBlog = async (req, res, next) => {
  const blogHandler = new BlogHandlerFn(req, res, next);
  const blog = blogHandler.publishBlog();
};

const readBlog = async (req, res, next) => {
    const blogHandler = new BlogHandlerFn(req, res, next);
    const blog = blogHandler.readBlog();

};

module.exports = {
  createBlog,
  allBlog,
  myBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  readBlog,
};
