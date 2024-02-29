"use strict"

const express = require("express")
const { asyncHandler } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/auth.Utils")
const router = express.Router()
const DiscountController = require("../../controllers/discount.controller")

router.get('/discounts/product', asyncHandler(DiscountController.getAllDiscountCodeWithProduct))
router.get('/discounts/shop', asyncHandler(DiscountController.getAllDiscountCodeByShop))
router.get('/discounts/amount', asyncHandler(DiscountController.getDiscountAmount))

router.use(authenticationV2)
//authentication 
router.get('/discounts', asyncHandler(DiscountController.deleteDiscountCode))
router.post('/discounts', asyncHandler(DiscountController.createDiscountCode))
router.patch('/discounts/:id', asyncHandler(DiscountController.updateDiscountCode))


module.exports = router