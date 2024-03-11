"use strict"

const { cart } = require("../models/cart.model")
const { getProudctById } = require("../models/repositories/product.repo")
const { NotFoundError } = require("../core/error.response")
class CartService {

    static async addToCart({ userId, products }) {
        const query = {
            cart_userId: userId,
            cart_state: "active"
        }
        return await cart.findOneAndUpdate(query,
            {
                $addToSet: {
                    cart_products: products
                }
            },
            {
                upsert: true,
                new: true,
            }
        )
    }

    static async updateCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: "active"
        }
        return await cart.findOneAndUpdate(query,
            {
                $inc: {
                    "cart_products.$.quantity": quantity
                }
            },
            {
                upsert: true,
                new: true,
            }
        )
    }

    static async addProductToCart({ userId, product }) {
        // check cart exits
        const userCart = await cart.findOne({ cart_userId: userId })
        if (!userCart) {
            return await CartService.createCart({ userId, product })
        }

        // if has cart but emty products
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        return CartService.updateCartQuantity({ userId, product })
    }

    // update cart 
    /**
     * shop_order_ids:[
     *  {
     *      shopId,
     *      item_products: {
     *            quantity
     *            price
     *            shopId,
     *             old_quantity,
     *              productId
     *          },
     *      version 
     *  }
     *  ]
     */

    static async addToCartV2({ userId, shop_order_ids = [] }) {
        const { quantity, old_quantity, productId } = shop_order_ids[0]?.item_products[0]
        const foundProduct = await getProudctById(productId)
        if (!foundProduct) return new NotFoundError("product not found")
        //compare
        if (foundProduct.product_shop != shop_order_ids[0].shopId) return new NotFoundError("product be long to the shop")

        if (quantity == 0) {

        }

        return await CartService.updateCartQuantity({
            userId,
            product: {
                productId: productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteItemInCart({ userId, productId }) {
        const query = {
            cart_userId: userId,
            cart_state: "active"
        }
        const deleteCart = await cart.updateOne(query, {
            $pull: {
                cart_products: { productId: productId }
            }
        })
        return deleteCart
    }

    static async deleteCart ({ userId }) {
        return await cart.deleteOne({ cart_userId: userId })
    }

    static async getListUserCart({ userId }) {
        return await cart.findOne({ cart_userId: userId }).lean()
    }
}

module.exports = CartService