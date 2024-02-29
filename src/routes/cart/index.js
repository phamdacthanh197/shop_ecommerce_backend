"use strict"

const express = require("express")
const { asyncHandler } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/auth.Utils")
const router = express.Router()
const CartController = require("../../controllers/cart.controller")


// router.use(authenticationV2)
//authentication 
router.get('/cart', asyncHandler(CartController.listCart))
router.post('/cart', asyncHandler(CartController.addToCart))
router.delete('/cart', asyncHandler(CartController.delete))
router.post('/cart/update', asyncHandler(CartController.updateProductIncart)) 


module.exports = router