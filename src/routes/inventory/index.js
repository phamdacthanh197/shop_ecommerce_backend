"use strict"

const express = require("express")
const { asyncHandler } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/auth.Utils")
const inventoryController = require("../../controllers/inventory.controller")
const router = express.Router()

router.use(authenticationV2)
//authentication 
router.post('/inventory', asyncHandler(inventoryController.addStockToInventory))

module.exports = router