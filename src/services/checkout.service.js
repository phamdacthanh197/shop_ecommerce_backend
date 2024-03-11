'use strict'

const { findCartById } = require("../models/repositories/cart.repo")
const { BadRquestError, NotFoundError } = require("../core/error.response")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { product } = require("../models/product.model")
const { getDiscountAmount } = require("./discount.service")
const { acqurieLock, releaseLock } = require("./redis.service")
const { order } = require("../models/order.model")

class CheckoutService {

    // login and without login


    /*
        {
            cartId,
            useId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discount: {
                        code:
                        shopId:
                        discountId:
                    }
                    item_products: [
                        {
                            price: 
                            quantity:
                            productId:
                        }
                    ]
                }
            ]
        }
    
    */

    static async checkkoutReview({
        cartId, userId, shop_order_ids
    }) {
        // check cart is exits
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRquestError("cart not found")

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        }, shop_order_ids_new = []

        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discount = [], item_products = [] } = shop_order_ids[i]
            // check product available
            const checkProductServer = await checkProductByServer(item_products)
            console.log("checkproductServer::", checkProductServer)
            if (!checkProductServer[0]) throw new BadRquestError("order wrong")

            // tinh tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + Number(product.price) * Number(product.quantity)
            }, 0)

            // tong tien trc khi xu ly
            checkout_order.totalPrice += checkoutPrice

            // 

            let itemCheckout = {
                shopId,
                shop_discount,
                price_raw: checkoutPrice, // tong gia tri trc khi giam gi
                price_apply_discount: checkoutPrice,
                item_products: checkProductServer
            }

            // mew shp discount ton tai  cehck xem co hop le hay khong
            if (shop_discount.length > 0) {
                // imagin has one discout
                // get amount discount
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    code: shop_discount[0].code,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                // total discount reduce
                checkout_order.totalDiscount += discount

                itemCheckout.price_apply_discount = checkoutPrice - discount
            }
            if (discount > 0) {
            }

            // total checkout final
            checkout_order.totalCheckout += itemCheckout.price_apply_discount
            shop_order_ids_new.push(itemCheckout)

        }

        return {
            checkout_order,
            shop_order_ids,
            shop_order_ids_new
        }
    }

    // order
    static async orderByUser({
        shop_order_ids,
        userId,
        cartId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        // check mot lan nua xem vuot ton kho hay khong
        const products = shop_order_ids_new.flatMap(item => item.item_products)
        console.log("step1::::", products)
        const acquuireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i]
            const keyLock = await acqurieLock(productId, quantity, cartId)
            acquuireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        /// check new co mot san pham het hang torng kho 
        if (acquuireProduct.includes(false)) {
            throw BadRquestError("mot so san pham da dc cap nhat, vui long quay lai gio hang")
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        //  order thanh cong thi remove product co torng cart
        if(newOrder) {
            // remove product trong cart

        }

        return newOrder
    }

    // g
    static async getOrderByUser({ userId }) {
        return await order.find({ order_userId: userId }).lean()
    }

    static async getOneOrderByUser({ userId, orderId }) {
        return await order.findOne({ _id: orderId, order_userId: userId }).lean()
    }

    static cancelOrderByUser({ userId, orderId }) {
        return order.deleteOne({ _id: orderId, order_userId: userId })
    }

    static async updateOrderStatusByShop({ userId, orderId, status }) {
        return await order.updateOne({ _id: orderId, order_userId: userId }, { $set: { order_status: status } })
    }
}

module.exports = CheckoutService