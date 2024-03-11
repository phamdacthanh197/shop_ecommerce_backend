'use strict'

const { BadRquestError } = require("../core/error.response")
const { getProudctById } = require("../models/repositories/product.repo")


class InventoryService {

    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = "ha noi viet nam"
    }) {
        const product= await getProudctById(productId)
        if(!product) throw new BadRquestError("product not found")

        const query  = {
            inven_productId: productId,
            inven_shopId: shopId
        }, updateSet = {
            $inc: {
                inven_stock: stock
            }
        }, options = {
            upsert: true,
            new: true
        }
        return await inventory.updateOne(query, updateSet, options)
    }
}

module.exports = InventoryService