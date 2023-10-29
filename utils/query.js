const { blogModel } = require('./../model/blog');
const { userModel } = require('./../model/user');


class BlogSearch {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async search() {
        const searchQuery = { ...this.req.query };
        const page = parseInt(this.req.query.page) || 1;
        const pageSize = 20;
        const skip = (page - 1) * pageSize;

        if (searchQuery.title) {
            await this.searchByTitle(searchQuery.title, skip, pageSize);
        } else if (searchQuery.tags) {
            await this.searchByTags(searchQuery.tags, skip, pageSize);
        } else if (searchQuery.author) {
            console.log(searchQuery);
            await this.searchByAuthor(searchQuery.author, skip, pageSize);
        } else {
            await this.getAllBlogs(skip, pageSize);
        }
    }

    async myBlog() {
        const searchQuery = { ...this.req.query };
        const page = parseInt(this.req.query.page) || 1;
        const pageSize = 20;
        const skip = (page - 1) * pageSize;

        if (searchQuery.state === 'draft' || searchQuery.state === 'published') {
            await this.searchByState(searchQuery.state, skip, pageSize);
        } else {
            await this.allMyBlogs(skip, pageSize);
        }
    }
    async searchByTitle(title, skip, pageSize) {
        const nonCaseSensitive = new RegExp(title, 'i');
        const blogs = await blogModel.find({ title: nonCaseSensitive, state: "published" })
            .skip(skip)
            .limit(pageSize)
            .sort({ timestamp: -1 })
            .sort({ readCount: -1 })
            .sort({ readingTime: -1 })
        this.sendResponse(blogs);
    }

    async searchByTags(tags, skip, pageSize) {
        const nonCaseSensitive = new RegExp(tags, 'i');
        const blogs = await blogModel.find({ tags: nonCaseSensitive, state: "published" })
            .skip(skip)
            .limit(pageSize)
            .sort({ timestamp: -1 })
            .sort({ readCount: -1 })
            .sort({ readingTime: -1 })
        this.sendResponse(blogs);
    }

    async searchByAuthor(authorName, skip, pageSize) {
        const firstname = authorName;
        const nonCaseSensitive = new RegExp(firstname, 'i');
        const author = await userModel.findOne({ firstname: nonCaseSensitive });
        const authorId = author._id
        const blogs = await blogModel.find({ author: authorId, state: "published" })
            .skip(skip)
            .limit(pageSize)
            .sort({ timestamp: -1 })
            .sort({ readCount: -1 })
            .sort({ readingTime: -1 })
        this.sendResponse(blogs);
    }
    async searchByState(state, skip, pageSize) {
        const user = this.req.user.id
        const nonCaseSensitive = new RegExp(state, 'i');
        const blogs = await blogModel.find({ state: nonCaseSensitive, author: user })
            .skip(skip)
            .limit(pageSize)
            .sort({ timestamp: -1 })
            .sort({ readCount: -1 })
            .sort({ readingTime: -1 })
        this.sendResponse(blogs);
    }
    async allMyBlogs(skip, pageSize) {
        const { id } = this.req.user
        const blogs = await blogModel.find({ author: id })
            .skip(skip)
            .limit(pageSize)
            .sort({ timestamp: -1 })
            .sort({ readCount: -1 })
            .sort({ readingTime: -1 });
        this.sendResponse(blogs);
    }

    async getAllBlogs(skip, pageSize) {
        const blogs = await blogModel.find({ state: "published" })
            .skip(skip)
            .limit(pageSize)
            .sort({ timestamp: -1 })

        this.sendResponse(blogs);
    }

    sendResponse(blogs) {
        this.res.status(200).json({
            result: 'SUCCESS',
            message: 'view blogs',
            size: blogs.length,
            blogs,
        });
    }
}

module.exports = BlogSearch;


