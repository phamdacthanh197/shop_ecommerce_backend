"use_strict"

const express = require("express")
const  ProductController = require("../../controllers/product.controller")
const { asyncHandler } = require("../../helpers/asyncHandler")
const { authentication, authenticationV2 } = require("../../auth/auth.Utils")
const router = express.Router()

router.get('/products/search/:keySearch', asyncHandler(ProductController.searchProduct))
router.get('/products', asyncHandler(ProductController.findAllProducts))
router.get('/products/:id', asyncHandler(ProductController.findProduct))


//authentication 
router.use(authenticationV2)
router.post('/products', asyncHandler(ProductController.createProduct))
router.put('/products/publish/:id', asyncHandler(ProductController.pusblicProductShop))
router.put('/products/unpublish/:id', asyncHandler(ProductController.unPusblicProductShop))

// query 
router.get('/products/draft/all', asyncHandler(ProductController.getListDraftProduct))
router.get('/products/published/all', asyncHandler(ProductController.findAllPublishForShop))

module.exports = router 