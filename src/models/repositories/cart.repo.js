"use strict"

const { convertToObjectIdMongo } = require("../../utils")
const { cart } = require("../cart.model")


const findCartById  = async (cartId) => {
    return await cart.findById({ _id: convertToObjectIdMongo(cartId), cart_state: "active" }).lean()
}

module.exports = {
    findCartById
}