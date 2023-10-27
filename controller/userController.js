const { userModel } = require('./../model/user')
const { jwtToken } = require('./../utils/jwt')
const appError = require('../utils/errorhandler')
const sendEmail = require('./../utils/email')
const crypto = require('crypto')


async function signUp(req, res, next) {
    try {
        const body = req.body
        const newUser = await userModel.create(body)
        if (!newUser) {
            return next(new appError('fill in the correct details pls', 400))
        }

        const token = await jwtToken(newUser._id)
        const message = `Hey ${newUser.firstname}, we are excited to have you on board with us .\n kindly confirm your email.`
        await sendEmail(message, newUser)

        res.cookie('jwt', token, { httpOnly: true });
        res.status(201).json({ result: "SUCCESS", Message: 'You have succesfully signed Up', token, userProfile: newUser })
    } catch (err) {
        next(new appError(err, 500))
    }
}
async function Login(req, res, next) {
    try {
        const loginDetails = req.body
        // confirm if user exist
        const isValidUser = await userModel.findOne({ email: loginDetails.email })
        if (!isValidUser) {
            return next(new appError('this user is not found. kindly sign up', 404))
        }
        // compare user password
        const isValidPassowrd = await isValidUser.isValidPassword(loginDetails.password, isValidUser.password)


        if (!isValidPassowrd) {
            return next(new appError('invalid password or email', 401))
        }
        // generate a token for use
        const token = await jwtToken(isValidUser._id)

        res.cookie('jwt', token, { httpOnly: true });
        res.status(200).json({ result: "SUCCESS", Message: 'You are logged in now', token, user: isValidUser })
    } catch (err) {
        next(new appError(err, 500))
    }
}


async function updateProfile(req, res, next) {
    try {
        if (req.user.active === true) {
            const updatesDetails = req.body
            const updatedUser = userModel.findByIdAndUpdate(req.user, updatesDetails, { new: true, runValidators: true })
            if (updatedUser) res.status(200).json({ result: "Success", message: 'user details has been succefully updated' })
        }
        else {
            return next(new appError('User does not exist kindly signUp', 404))
        }
    } catch (err) {
        next(new appError(err, 500))
    }

}
async function deleteAcct(req, res, next) {
    try {
        const user = await userModel.findById(req.user.id).select('-password')
        user.active = false
        await user.save()
        if (user) res.status(203).json({ result: "Success", message: 'Account deletion successful', user })
    } catch (err) {
        next(new appError(err, 500))
    }

}

const logout = (req, res) => {


    res.clearCookie('jwt', {
        httpOnly: true
    })

    return res.status(200).json({ message: 'You have been successfully logged out' });
};

const forgetPassword = async (req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) return next(new appError('this user does not exist', 404))
        const resetToken = await user.createResetToken()

        console.log(resetToken)
        const emailMessage = `hey ${user.firstname} your passowrd reset code is :${resetToken}.\n
kindly click on the url to reset your password at ${req.protocol}://${req.get('host')}/resetPassowrd/${resetToken}`
        await sendEmail(emailMessage, user)
        await user.save({ validateBeforeSave: false })
        res.status(200).json({ message: 'your password reset token has been sent. check your mail box' })
    } catch (err) {
        new appError(err, 500)
    }

}

const resetPassword = async (req, res, next) => {
    try {
        const hashedToken = await crypto.createHash('sha256').update(req.params.token).digest('hex')
        const user = await userModel.findOne({ resetPasswordToken: hashedToken, resetTimeExp: { $gt: Date.now() } })
        if (!user) return next(new appError('invalid token or expired token', 404))

        user.password = req.body.password
        user.resetPasswordToken = undefined
        user.resetTimeExp = undefined

        await user.save()
        const token = await jwtToken(user._id)
        res.cookie('jwt', token, { httpOnly: true });
        res.status(200).json({ message: 'a new pasword has been set', token, user })


    } catch (err) {
        new appError(err, 500)
    }
}

const reactivateAcct = async (req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req.body.email }).select('-password')
        if (!user) next(new appError('this user does not exist', 404))
        user.active = true
        const message = `Hey ${user.firstname}, we are excited to have you on board with us .\n kindly confirm your email.`
        await sendEmail(message, user)
        await user.save()
        res.status(200).json({ message: `welcome back ${user.username}. your account has been re-activated`, user })
    } catch (err) {
        new appError(err, 500)
    }
}
module.exports = { signUp, updateProfile, deleteAcct, Login, logout, forgetPassword, resetPassword, reactivateAcct }