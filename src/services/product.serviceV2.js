'use strict'

const { model } = require('mongoose')
const { BadRquestError } = require('../core/error.response')
const { product, clothing, electronic, furniture } = require('../models/product.model')
const { findAllDraftsForShop, pusblicProductShop, findAllPublishForShop, unPusblicProductShop, searchProduct, findAllProducts, findProduct, updateProductById } = require('../models/repositories/product.repo')
const { removeUndefinedObject, updateNesttedObject } = require('../utils')
const { insertInventory } = require('../models/repositories/inventory.repo')
//  define factory class to create product

class ProductFactory {

    /**
     * types: "clothing",
     * playload
     */

    static registryProductKey = {}

    static registryProductType(key, classRef) {
        ProductFactory.registryProductKey[key] = classRef
    }

    //post
    static async createProduct(type, playload) {
        const productClass = ProductFactory.registryProductKey[type]
        if (!productClass) throw new BadRquestError(`Invalid product type ${type}`)

        return new productClass(playload).createProduct()
    }

    // put
    static async updateProduct(type, productId, playload) {
        const productClass = ProductFactory.registryProductKey[type]
        if (!productClass) throw new BadRquestError(`Invalid product type ${type}`)
        return new productClass(playload).updateProduct(productId)
    }

    // get publish for shop 
    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }

        return await findAllPublishForShop({ query, limit, skip })
    }

    // get draft for shop
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }

        return await findAllPublishForShop({ query, limit, skip })
    }

    // put 
    static async pusblicProductShop({ product_shop, product_id }) {
        return await pusblicProductShop({ product_shop, product_id })
    }

    static async unPusblicProductShop({ product_shop, product_id }) {
        return await unPusblicProductShop({ product_shop, product_id })
    }

    static async searchProduct({ keySearch }) {
        return await searchProduct({ keySearch })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({ limit, sort, page, filter, select: ["product_name", "product_thumb", "product_price"] })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ["__v"] })
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
        const newProduct = await product.create({
            ...this, _id: product_id
        })
        if (newProduct) {
            // add product stock in inventory colection
            await insertInventory(
                {
                    productId: newProduct._id,
                    shopId: this.product_shop,
                    stock: this.product_quantity
                }
            )
        }
        return newProduct
    }

    // update Proudct 
    async updateProduct(productId, playload) {
        return await updateProductById({
            productId,
            playload,
            model: product
        })
    }
}

// defind sub -class for difference product types colting

class Clothing extends Product {
    async createProduct() {
        const newColting = await clothing.create({
            ...this.product_attribute,
            product_shop: this.product_shop
        })
        if (!newColting) throw new BadRquestError(' create colting error')

        const newProduct = await super.createProduct(newColting._id)
        if (!newProduct) throw new BadRquestError(' create product error')

        return newProduct
    }

    async updateProduct(productId) {
        // 1 remove attr has null undefind  
        const objectParam = removeUndefinedObject(this)
        // 2 check update for colting
        if (objectParam.product_attribute) {
            // update child
            await updateProductById({
                productId,
                playload: updateNesttedObject(objectParam.product_attribute),
                model: clothing
            })
        }
        const updateProduct = await super.updateProduct(productId, updateNesttedObject(objectParam))
        return updateProduct
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

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attribute,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRquestError(' create colting error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRquestError(' create product error')

        return newProduct
    }
}

ProductFactory.registryProductType("Furniture", Furniture)
ProductFactory.registryProductType("Clothing", Clothing)
ProductFactory.registryProductType("Elictronic", Electronic)

module.exports = ProductFactory