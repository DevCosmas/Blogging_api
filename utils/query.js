const { blogModel } = require('./../model/blog');

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

    async searchByTitle(title, skip, pageSize) {
        const nonCaseSensitive = new RegExp(title, 'i');
        const blogs = await blogModel.find({ title: nonCaseSensitive })
            .skip(skip)
            .limit(pageSize)
            .sort({ timestamp: -1 })
            .sort({ readCount: -1 })
            .sort({ readingTime: -1 })
        this.sendResponse(blogs);
    }

    async searchByTags(tags, skip, pageSize) {
        const nonCaseSensitive = new RegExp(tags, 'i');
        const blogs = await blogModel.find({ tags: nonCaseSensitive })
            .skip(skip)
            .limit(pageSize)
            .sort({ timestamp: -1 })
            .sort({ readCount: -1 })
            .sort({ readingTime: -1 })
        this.sendResponse(blogs);
    }

    async searchByAuthor(authorName, skip, pageSize) {
        const firstname = authorName;
        console.log(firstname);
        const nonCaseSensitive = new RegExp(firstname, 'i');
        const blogs = await blogModel.find({ 'author.firstname': nonCaseSensitive })
            .skip(skip)
            .limit(pageSize)
            .sort({ timestamp: -1 })
            .sort({ readCount: -1 })
            .sort({ readingTime: -1 })
        this.sendResponse(blogs);
    }

    async getAllBlogs(skip, pageSize) {
        const blogs = await blogModel.find()
            .skip(skip)
            .limit(pageSize)
            .sort({ timestamp: -1 })
            .sort({ readCount: -1 })
            .sort({ readingTime: -1 });
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


