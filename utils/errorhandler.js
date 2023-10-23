class appError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode;
        this.result = `${statusCode}`.startsWith('4') ? 'FAIL' : 'error';
        this.isOperational = true;


        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports= appError