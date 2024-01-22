'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Product"
const COLLECTION_NAME = "Products"

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_description: {
        type: String,
    },
    product_price: {
        type: String,
    },
    product_quantity: {
        type: String,
        required: true,
    },
    product_attribute: {
        type: Schema.Types.Mixed,
        required: true,
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop"
    },
    product_type: {
        type: String,
        required: true,
        enum: ["Electronic", "Clothing", 'Furniture']
    },

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// define product type == clothing

const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    merterial: String
}, {
    timestamps: true,
    collection: "Cloths"
});

const electronicSchema = new Schema({
    manufacturer: { type: String, require: true },
    model: String,
    colors: String,
    product_shop: {type: Schema.Types.ObjectId, require: true}
}, {
    timestamps: true,
    collection: "Electronics"
});

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model("Electronics", electronicSchema),
    clothing: model("Clothings", clothingSchema),
}