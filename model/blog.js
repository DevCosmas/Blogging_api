const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'a blog must have a title'],
        toLowerCase: true
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        toLowerCase: true
    },
    readCount: {
        type: Number,
        default: 0
    },
    readingTime: {
        type: Number
    },
    bodyContent: {
        type: String
    },
    tags: {
        type: String,
        toLowerCase: true
    },
    state: {
        type: String,
        default: 'draft',
        enum: ['draft', 'published']
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'rating' }],
    ratingAvg: {
        type: Number,
        default: 3.5
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }

)
blogSchema.methods.calReadTime = function (content) {

    if (typeof content !== 'string' || content.trim() === '') {
        return 0;
    }
    let wpm = 250
    const word = content.split(/\s+/)
    const wordCount = word.length
    const readTime = wordCount / wpm
    return Math.ceil(readTime);

}

blogSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'author',
        select: 'firstname -_id '
    })
    next()
})

// blogSchema.pre('save', function (next) {


//     if (this.title && typeof this.title === 'string') {
//         this.title = this.title.toLowerCase();
//     }
//     if (this.tags && typeof this.tags === 'string') {
//         this.tags = this.tags.toLowerCase();
//     }
//     if (this.author && typeof this.author === 'string') {
//         this.author = this.author.toLowerCase();
//     }
//     next();

// });



const blogModel = mongoose.model('blog', blogSchema)
module.exports = { blogModel }