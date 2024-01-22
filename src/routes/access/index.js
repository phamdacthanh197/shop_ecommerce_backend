"use_strict"

const express = require("express")
const AccessController = require("../../controllers/access.controller")
const { asyncHandler } = require("../../helpers/asyncHandler")
const { authentication ,authenticationV2 } = require("../../auth/auth.Utils")
const router = express.Router()

// sign up
router.post('/shop/signup', asyncHandler(AccessController.signUp))
router.post('/shop/login', asyncHandler(AccessController.login))

//authentication 
router.use(authenticationV2)
router.post('/shop/logout', asyncHandler(AccessController.logout))
router.post('/shop/handlerRefreshToken', asyncHandler(AccessController.handleRefreshToken))


module.exports = router