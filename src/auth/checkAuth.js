'use strict'

const { findById } = require("../services/apiKey.service")

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization"

}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                message: "forbiden error"
            })
        }
        // check objKey
        const objkey = await findById(key)
        if (!objkey) {
            return res.status(403).json({
                message: "forbiden error"
            })
        }
        req.objkey = objkey
        return next()

    } catch (error) {
        console.error("key check fail or has error", error)
    }
}

const permisson = (permission) => {
    return (req, res, next) => {
        if (!req.objkey.permissions) {
            return res.status(403).json({
                message: "forbiden error"
            })
        }
        console.log('permissons::', req.objkey.permissions)
        const validatePermison = req.objkey.permissions.includes(permission)
        if (!validatePermison) {
            return res.status(403).json({
                message: "forbiden error"
            })
        }

        return next()
    }
}

module.exports = {
    apiKey,
    permisson,
}