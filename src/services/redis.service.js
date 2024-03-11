' use strict'

const redis = require('redis')
const { promisify } = require("util")
const { reservationInventory } = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient()

const pexprie = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acqurieLock = async (productId, qunatity, cartId) => {
    const key = `lock:v2024_${productId}`
    const retryTime = 10;
    const exprireTime = 3000 // 3 seconds lock

    for (let i = 0; i < retryTime.length; i++) {
        // tao mot key, thang nao nam giu dc vao thanh toan
        const result = await setnxAsync(key, exprireTime)
        console.log("result:::", result)
        if (result === 1) {
            // thao tac voi inventory
            const isReservation = await reservationInventory({ productId, qunatity, cartId })
            if(isReservation.modifiedCount) {
                await pexprie(key, exprireTime)
                return key
            }
            return null
        } else {
            await new Promise(resolve => setTimeout(resolve, 50))
        }

    }
}

const releaseLock = async (key) => {
    const delkAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delkAsyncKey(key)
}

module.exports = {
    acqurieLock,
    releaseLock
}
