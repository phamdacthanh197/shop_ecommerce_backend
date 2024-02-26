"use-strict"

const { BadRquestError, NotFoundError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { findAllDisCountCodeUnSelect } = require("../models/repositories/discount.repo")
const { findAllProducts } = require("../models/repositories/product.repo")
const { convertToObjectIdMongo } = require("../utils")

/**
 * @desc discount service
 * 1 - generator dicont code
 * 2 - get discount amount
 * 3 - get all discout code
 * 4 -  check discount code
 * 5 -  delete discount code
 * 6 -  cancel discount code
 *  @class DiscountService
 */


class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            prouctIds,
            applies_to,
            name,
            description, type, value, user_used, max_value, max_uses, uses_count, max_uses_per_user
        } = payload
        // checking
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRquestError("discount code has expried")
        }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRquestError("start date must be befor end date")
        }

        // create index fro discoutn code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongo(shopId)
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRquestError("discount code is already exist")
        }

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_discription: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_user_used: user_used,
            discount_max_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_producIds: applies_to === "all" ? [] : prouctIds
        })

        return newDiscount
    }

    static async updateDiscountCode(productId) {
        // 1 remove attr has null undefind  
        // const objectParam = removeUndefinedObject(this)
        // // 2 check update for colting
        // if (objectParam.product_attribute) {
        //     // update child
        //     await updateProductById({
        //         productId,
        //         playload: updateNesttedObject(objectParam.product_attribute),
        //         model: clothing
        //     })
        // }
        // const updateProduct = await super.updateProduct(productId, updateNesttedObject(objectParam))
        // return updateProduct
    }

    /**
     * 
     * @param {*} {code, shopId, userId, limit, page} 
     * @returns  proudcts
     */
    static async getAllDiscountCodeWithProduct(
        { code, shopId, userId, limit, page }
    ) {
        //  create index for discount
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongo(shopId)
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError("discount code is not found")
        }

        const { discount_applies_to, discount_producIds } = foundDiscount
        let products
        if (discount_applies_to === 'all') {
            // get all product

            proudcts = await findAllProducts({ limit, page })
        }


        if (discount_applies_to === 'specific') {
            // get specific

            proudcts = await findAllProducts({
                filter: {
                    _id: { $in: discount_producIds },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"]
            })
        }

        return products

    }

    static async getAllDiscountCodeByShop({ shopId, limit, page }) {
        const discounts = await findAllDisCountCodeUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongo(shopId),
                discount_is_active: true
            },
            unSelect: ["_v","discount_shopId"],
            model: discountModel
        })
        return discounts
    }
}


