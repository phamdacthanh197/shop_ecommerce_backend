'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required
const { default: slugify } = require('slugify');

const DOCUMENT_NAME = "Product"
const COLLECTION_NAME = "Products"

// Declare the Schema of the Mongo model
const productSchema = new Schema({
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
    product_slug: { type: String },
    product_average: {
        type: Number,
        default: 4.5,
        min: [1, "rating must be above 1.0"],
        max: [5, "rating must be below 5.0"],
        set: (value) => Math.round(value * 10) / 10
    },
    product_type: {
        type: String,
        required: true,
        enum: ["Electronic", "Clothing", 'Furniture']
    },
    product_variation: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// crate in dex for search
productSchema.index({ product_name: 'text', product_description: 'text' })

// document midleware: run before .save()
// web hook 
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

// define product type == clothing

const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    merterial: String,
    product_shop: { type: Schema.Types.ObjectId, require: true }
}, {
    timestamps: true,
    collection: "Cloths"
});

const electronicSchema = new Schema({
    manufacturer: { type: String, require: true },
    model: String,
    colors: String,
    product_shop: { type: Schema.Types.ObjectId, require: true }
}, {
    timestamps: true,
    collection: "Electronics"
});

const furnitureSchema = new Schema({
    manufacturer: { type: String, require: true },
    model: String,
    colors: String,
    product_shop: { type: Schema.Types.ObjectId, require: true }
}, {
    timestamps: true,
    collection: "Furnitures"
});

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model("Electronics", electronicSchema),
    clothing: model("Clothings", clothingSchema),
    furniture: model("Furnitures", furnitureSchema),
}