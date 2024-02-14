"use_strict"

const { CREATED, SuccessResponse } = require('../core/success.response')
const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.serviceV2')

class ProductController {

    // createProduct = async (req, res, next) => {
    //     new SuccessResponse({
    //         message: "creat new Product success",
    //         metaData: await ProductService.createProduct(req.body.product_type, {
    //             ...req.body,
    //             product_shop: req.user.userId
    //         })
    //     }).send(res)
    // }

    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "creat new Product success",
            metaData: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    // update product by id 
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "updateProduct product succes",
            metaData: await ProductServiceV2.updateProduct(req.body.product_type, req.params.id, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    // create product by id
    pusblicProductShop = async (req, res, next) => {
        new SuccessResponse({
            message: "publish product succses",
            metaData: await ProductServiceV2.pusblicProductShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    unPusblicProductShop = async (req, res, next) => {
        new SuccessResponse({
            message: "unPusblicProductShop product succses",
            metaData: await ProductServiceV2.unPusblicProductShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    //query 
    /**
     * @desc get all Draft fo shop
     * @param {number} limit 
     * @param {number} skip
     * @param {string} product_shop 
     * @returns { JSON}
     */
    getListDraftProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "get list draft product succes",
            metaData: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    //put 

    findAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "get list publish product succes",
            metaData: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }


    // serach 
    searchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "get list searchProduct product succes",
            metaData: await ProductServiceV2.searchProduct({
                keySearch: req.params.keySearch
            })
        }).send(res)
    }

    // find all
    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "get list findAllProducts product succes",
            metaData: await ProductServiceV2.findAllProducts({
                keySearch: req.params.keySearch
            })
        }).send(res)
    }
    // find product by id
    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "get list findProduct product succes",
            metaData: await ProductServiceV2.findProduct({
                product_id: req.params.id
            })
        }).send(res)
    }

}

module.exports = new ProductController()