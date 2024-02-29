"use strict"

const { SuccessResponse } = require('../core/success.response')
const CartService = require('../services/cart.service')
class CartController {


    /**
     * @desc add to cart
     * @param {int} useDd 
     * @param {*} res 
     * @param {*} next 
     * @method POST
     * @route /api/v1/cart
     * @returns {
     * 
     * }
     */
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "create new cart success",
            metaData: await CartService.addToCart({
                ...req.body,
            })
        }).send(res)
    }

    updateProductIncart = async (req, res, next) => {
        new SuccessResponse({
            message: "update new cart success",
            metaData: await CartService.addToCartV2({
                ...req.body,
            })
        }).send(res)
    }

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: "delete cart success",
            metaData: await CartService.deleteUserCart({
                ...req.body,
            })
        }).send(res)
    }

    listCart = async (req, res, next) => {
        new SuccessResponse({
            message: "get list cart success",
            metaData: await CartService.getListUserCart(
                req.query
            )
        }).send(res)
    }


}

module.exports = new CartController()