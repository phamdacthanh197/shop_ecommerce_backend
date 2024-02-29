"use strict"

const { SuccessResponse } = require('../core/success.response')
const DiscountService = require('../services/discount.service')
class DiscountController {

    createDiscountCode = async (req, res, next) => {
        console.log("req.body", req.body)
        new SuccessResponse({
            message: "createDiscount success",
            metaData: await DiscountService.createDiscountCode({
                ...req.body,
                discount_shopId: req.user.userId
            })
        }).send(res)
    }


    updateDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "updateDiscountCode success",
            metaData: await DiscountService.updateDiscountCode(req.params.id, {
                ...req.body,
            })
        }).send(res)
    }

    getAllDiscountCodeWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "getAllDiscountCodeWithProduct success",
            metaData: await DiscountService.getAllDiscountCodeWithProduct(
                {
                    limit: req.query.limit,
                    page: req.query.page,
                    shopId: req.query.shopId,
                    code: req.query.code
                }
            )
        }).send(res)
    }
    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: "getDiscountAmount success",
            metaData: await DiscountService.getDiscountAmount(
                {
                    ...req.body
                }
            )
        }).send(res)
    }

    getAllDiscountCodeByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "getAllDiscountCodeByShop success",
            metaData: await DiscountService.getAllDiscountCodeByShop(
                {
                    limit: req.query.limit,
                    page: req.query.page,
                    shopId: req.query.shopId
                }
            )
        }).send(res)
    }

    deleteDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "deleteDiscountCode success",
            metaData: await DiscountService.deleteDiscountCode(
            {
                ...req.body
            }
            )
        }).send(res)
    }

    cancelDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "deleteDiscountCode success",
            metaData: await DiscountService.cancelDiscountCode(
                {
                    limit: req.query.limit,
                    page: req.query.page,
                    shopId: req.query.shopId
                }
            )
        }).send(res)
    }

}

module.exports = new DiscountController()