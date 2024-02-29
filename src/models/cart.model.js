"use strict"

const { Types, model, Schema } = require("mongoose")

const DOCUMENT_NAME = "Cart"
const COLLECTION_NAME = "Carts"

const cartsSchema = new Schema({
    cart_state: {
        type: String, require: true,
        enum: ["active", "failed", "complete", "pending"],
        default: "active"
    },
    cart_products: {
        type: Array,require: true, default: []
    },
    cart_count_product: {
        type: Number, require: true, default: 0
    },
    cart_userId: {
        type: Number, require: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = {
    cart: model(DOCUMENT_NAME, cartsSchema)
}