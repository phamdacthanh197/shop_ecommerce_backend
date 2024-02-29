"use-strict"

const { BadRquestError, NotFoundError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { findAllDisCountCodeUnSelect, updateDiscountByid, findAllDisCountCodeSelect, checkDiscountExits } = require("../models/repositories/discount.repo")
const { findAllProducts } = require("../models/repositories/product.repo")
const { convertToObjectIdMongo, removeUndefinedObject } = require("../utils")

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
            discount_name,
            discount_discription,
            discount_type,
            discount_value,
            discount_code,
            discount_start_date,
            discount_end_date,
            discount_max_uses,
            discount_uses_count,
            discount_user_used,
            discount_max_per_user,
            discount_min_order_value,
            discount_shopId,
            discount_is_active,
            discount_applies_to,
            discount_producIds,
            max_value,
            created_by
        } = payload
        // checking
        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new BadRquestError("discount code has expried")
        }

        if (new Date(discount_start_date) >= new Date(discount_end_date)) {
            throw new BadRquestError("start date must be befor end date")
        }

        // create index fro discoutn code
        const foundDiscount = await discountModel.findOne({
            discount_code,
            discount_shopId: convertToObjectIdMongo(discount_shopId)
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRquestError("discount code is already exist")
        }

        const newDiscount = await discountModel.create({
            discount_name,
            discount_discription,
            discount_type,
            discount_value,
            discount_code,
            discount_start_date: new Date(discount_start_date),
            discount_end_date: new Date(discount_end_date),
            discount_max_uses,
            discount_uses_count,
            discount_user_used,
            discount_max_per_user,
            discount_min_order_value,
            discount_shopId,
            discount_is_active,
            discount_applies_to,
            discount_producIds: discount_applies_to === "all" ? [] : discount_producIds
        })

        return newDiscount
    }

    static async updateDiscountCode({
        discountId,
        playload
    }) {
        // 1 remove attr has null undefind  
        const objectParam = removeUndefinedObject(playload)
        // 2 check update for colting
        const updateDiscount = await updateDiscountByid({
            discountId,
            objectParam,
            model: discountModel
        })
        return updateDiscount
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
        console.log(foundDiscount, "applies")

        let products
        if (discount_applies_to === 'all') {
            // get all product
            products = await findAllProducts({ limit, page })
        }


        if (discount_applies_to === 'specific') {
            // get specific

            products = await findAllProducts({
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
            unSelect: ["_v", "discount_shopId"],
            model: discountModel
        })
        return discounts
    }

    static async getDiscountAmount({ code, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExits({
            model: discountModel,
            filter: {
                discount_shopId: convertToObjectIdMongo(shopId),
                discount_code: code
            }
        })

        if (!foundDiscount) {
            throw new NotFoundError("discount code is not found")
        }
        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_user_used,
            discount_type,
            discount_start_date,
            discount_end_date,
            discount_value,

        } = foundDiscount
        if (!discount_is_active) throw new NotFoundError("discount expried")
        if (!discount_max_uses) throw new NotFoundError("discount are out")

        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new BadRquestError("discount code has expried")
        }

        // check xem co set gia tri toi thieu ha khong 
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            // get tatal 
            totalOrder = products.reduce((total, product) => {
                return total + (product.price * product.quantity)
            }, 0)

            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(`discount min order value ${discount_min_order_value} vnd`)
            }
        }
        if (discount_user_used.length > 0) {
            const userAlreadyUsed = discount_user_used.find(user => user.userId === userId)
            if(userAlreadyUsed) {
                throw new NotFoundError("This discoutn already used by you")
            }
        }
        // check discoutn is fixed amount
        const amount = discount_type === "fixed_amount" ? discount_value : (discount_value / 100) * totalOrder

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({ shopId, code }) {
        const deleted = await discountModel.findOneAndDelete({
            discount_code: code,
            discount_shopId: convertToObjectIdMongo(shopId)
        })

        return deleted
    }

    static async cancelDiscountCode({ shopId, code, userId }) {
        const foundDiscount = await checkDiscountExits({
            model: discountModel,
            filter: {
                discount_shopId: convertToObjectIdMongo(shopId),
                discount_code: code
            }
        })

        if(!foundDiscount) {
            throw new NotFoundError("discount code is not exits")
        }

        const result = await discountModel.findOneAndUpdate(
            foundDiscount._id,
            {
                $pull: {
                    discount_user_used: userId
                },
                $inc: {
                    discount_max_uses: 1,
                    discount_user_used: -1
                }
            }
        )
        return result
    }
}

module.exports = DiscountService


