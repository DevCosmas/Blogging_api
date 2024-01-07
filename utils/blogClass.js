const { blogModel } = require('./../model/blog');
const appError = require('../utils/errorhandler');
const SendResponse = require('../utils/sendJsonResponse');

class BlogHandlerFn {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async createBlog() {
    const sendResponse = new SendResponse(this.res);
    try {
      if (this.req.user.active === true) {
        const blogPost = this.req.body;
        blogPost.author = this.req.user.id;
        const newBlog = await blogModel.create(blogPost);
        newBlog.readingTime = newBlog.calReadTime(blogPost.bodyContent);
        if (!newBlog)
          return this.next(new appError('this blog post was not created', 400));
        sendResponse.sendJson(newBlog, 'You have created a new blog post', 201);
      } else {
        return this.next(
          new appError('User does not exist kindly signUp', 404)
        );
      }
    } catch (err) {
      this.next(new appError(err, 500));
    }
  }

  async updateBlog() {
    const sendResponse = new SendResponse(this.res);
    try {
      if (!this.req.user.active === true)
        return this.next(
          new appError('You are not authorized. Kindly sign up or login')
        );
      const blog = await blogModel.findById(this.req.params.blogId);
      if (!blog) return this.next(new appError('this blog is not found', 404));

      if (blog.author.id === this.req.user.id) {
        const updates = this.req.body;

        const updatedBlog = await blogModel.updateOne(
          { _id: this.req.params.blogId },
          updates
        );
        sendResponse.sendJson(updatedBlog, 'You have updated a blog post', 200);
      } else {
        this.next(
          new appError('You are not authorized to update this blog', 403)
        );
      }
    } catch (err) {
      this.next(new appError(err, 500));
    }
  }

  async deleteBlog() {
    const sendResponse = new SendResponse(this.res);
    try {
      if (!this.req.user.active === true)
        return this.next(
          new appError('You are not authorized. Kindly sign up or login')
        );

      const blog = await blogModel.findById(this.req.params.blogId);
      if (!blog) return this.next(new appError('this blog is not found', 404));
      if (blog.author.id === this.req.user.id) {
        const deletedBlog = await blogModel.deleteOne({
          _id: this.req.params.blogId,
        });
        sendResponse.sendJson(deletedBlog, 'you have deleted a blog', 203);
      } else {
        this.next(
          new appError('You are not authorized to delete this blog', 403)
        );
      }
    } catch (err) {
      this.next(new appError(err, 500));
    }
  }

  async publishBlog() {
    const sendResponse = new SendResponse(this.res);
    try {
      if (!this.req.user.active === true)
        return this.next(
          new appError('You are not authorized. Kindly sign up or login')
        );
      const blog = await blogModel.findById(this.req.params.blogId);
      if (!blog) return this.next(new appError('this blog is not found', 404));
      if (blog.author.id === this.req.user.id) {
        blog.state = 'published';
        blog.save();
        sendResponse.sendJson(blog, 'blog publication succesful', 200);
      } else {
        this.next(
          new appError('You are not authorized to publish this blog', 403)
        );
      }
    } catch (err) {
      this.next(new appError(err, 500));
    }
  }

  async readBlog() {
    const sendResponse = new SendResponse(this.res);
    try {
      const blog = await blogModel
        .findById(this.req.params.blogId)
        .populate('reviews');
      if (!blog) return this.next(new appError('this blog is not found', 404));
      else {
        blog.readCount = (blog.readCount || 0) + 1;
        await blog.save();
        sendResponse.sendJson(blog, 'Thank you for reading', 200);
      }
    } catch (err) {
      this.next(new appError(err, 500));
    }
  }
}

module.exports = BlogHandlerFn;
