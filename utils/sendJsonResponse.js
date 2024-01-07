class SendResponse {
  constructor(res) {
    this.res = res;
  }

  sendJson(doc, message, statusCode) {
    return this.res.status(statusCode).json({
      status: 'SUCCESS',
      message,
      size: doc.length,
      data: doc,
    });
  }
}
module.exports = SendResponse;
