"use strict"

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Order"
const COLLECTION_NAME = "Orders"

// Declare the Schema of the Mongo model
var orderSchema = new Schema({
    order_userId: {type: Number, required: true},
    order_checkout: {type: Object, default: {}},
    /*
                   totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
     */
    order_shipping: {type: Object, default: {}},
    order_payment: {type: Object, default: {}},
    order_products: {type: Array, default: []},
    order_trackingNumber: {type: String, default: "#000118022024"},
    order_status: {type: String, enum: ["pending", "confirm", "shipped", 'cancelled', 'delivered'] , default: "pending"}

}, {
    timestamps: true,
    colection: COLLECTION_NAME
});

//Export the model
module.exports = {
    order: model(DOCUMENT_NAME, orderSchema)
};