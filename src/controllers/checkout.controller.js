"use strict"

const { SuccessResponse } = require('../core/success.response')
const CheckoutService = require('../services/checkout.service')
class CheckoutController {

    checkkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: "createCheckout success",
            metaData: await CheckoutService.checkkoutReview({
                ...req.body,
            })
        }).send(res)
    }
}

module.exports = new CheckoutController()