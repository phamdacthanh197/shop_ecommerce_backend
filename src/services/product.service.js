'use strict'

const { BadRquestError } = require('../core/error.response')
const { product, clothing, electronic } = require('../models/product.model')

//  define factory class to create product

class ProductFactory {

    /**
     * types: "clothing",
     * playload
     */

    static async createProduct(type, playload) {
        switch (type) {
            case "Electronic":
                return new Electronic(playload).createProduct()
            case "Clothing":
                return new Clothing(playload).createProduct()
            default:
                throw new BadRquestError(`invalid product type ${type}`)
        }
    }
}

// define base product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_attribute,
        product_shop,
        product_type,
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_attribute = product_attribute
        this.product_shop = product_shop
        this.product_type = product_type
    }

    async createProduct(product_id) {
        return await product.create({
            ...this, _id: product_id
        })
    }
}

// defind sub -class for difference product types colting

class Clothing extends Product {
    async createProduct() {
        const newColting = await clothing.create(this.product_attribute)
        if (!newColting) throw new BadRquestError(' create colting error')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRquestError(' create product error')

        return newProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attribute,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRquestError(' create colting error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRquestError(' create product error')

        return newProduct
    }
}

module.exports = ProductFactory