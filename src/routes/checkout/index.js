"use strict"

const express = require("express")
const { asyncHandler } = require("../../helpers/asyncHandler")
const checkoutController = require("../../controllers/checkout.controller")
const router = express.Router()

router.post('/checkout/review', asyncHandler(checkoutController.checkkoutReview))

module.exports = router