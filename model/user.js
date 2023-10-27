const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const validator = require('validator')
const crypto = require('crypto')

const userSchema = new Schema({

    email: {
        type: String,
        required: [true, 'A user must have an emmail'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: 'Invalid email address',
        },
    },
    firstname: {
        type: String,
        required: [true, 'A user must have a name'],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, 'A user must have a name'],
        trim: true
    },
    photo: {
        type: String,
        trim: true,
        default: 'TackleDefaultPics.png'
    },
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    resetPasswordToken: String,
    resetTimeExp: Date,
    active: {
        type:Boolean,
        default:true
    }

})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)

})
userSchema.methods.isValidPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}
userSchema.methods.createResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetTimeExp = Date.now() + 10 * 60 * 1000

    return resetToken
}

const userModel = mongoose.model('user', userSchema)
module.exports = { userModel }