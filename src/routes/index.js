"use strict"

const expres = require("express")
const { apiKey, permisson } = require("../auth/checkAuth")
const router = expres.Router()

//checkApi key
router.use(apiKey)
// check permisson
router.use(permisson("0000"))

router.use("/v1/api", require("./products")) 
router.use("/v1/api", require("./cart")) 
router.use("/v1/api", require("./discounts")) 
router.use("/v1/api", require("./access"))

module.exports = router