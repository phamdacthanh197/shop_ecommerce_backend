'use strict'

const {StatusCodes, ReasonPhrases} = require("../utils/httpStatusCode")


class ErrorResponce extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConFlicRequestError extends ErrorResponce {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT) {
        super(message, statusCode)
    }
}

class BadRquestError extends ErrorResponce {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponce {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode)
    }
}
class NotFoundError extends ErrorResponce {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode)
    }
}

class ForbidenError extends ErrorResponce {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode)
    }
}

module.exports = {
    ConFlicRequestError,
    BadRquestError,
    AuthFailureError,
    NotFoundError,
    ForbidenError
}