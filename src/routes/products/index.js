"use_strict"

const express = require("express")
const  ProductController = require("../../controllers/product.controller")
const { asyncHandler } = require("../../helpers/asyncHandler")
const { authentication } = require("../../auth/auth.Utils")
const router = express.Router()

//authentication q
router.use(authentication)
router.post('/products', asyncHandler(ProductController.createProduct))

module.exports = router