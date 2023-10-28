module.exports= function errohandler(err, req,res,next){
    err.statusCode= err.statusCode || 500
    err.result=err.result||'error'

    res.status(err.statusCode).json({
        result:err.result,
        message:err.message
    })
}