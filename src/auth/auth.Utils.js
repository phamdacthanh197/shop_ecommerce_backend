'use strict'

const JWT = require("jsonwebtoken")
const { asyncHandler } = require("../helpers/asyncHandler")
const { AuthFailureError, NotFoundError } = require("../core/error.response")
const { findByUseId } = require("../services/keytoken.service")

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
    REFRESHTOKEN: "x-token-id"
}

const createTokenPair = async (payload, puclickey, privateKey) => {
    try {
        // accessToken 
        const accessToken = await JWT.sign(payload, puclickey, {
            expiresIn: "100000000000000"
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: "7 days"
        })

        //

        JWT.verify(accessToken, puclickey, (err, decode) => {
            if (err) {
                console.error("error verify::", err)
            } else {
                console.log("devode verify::", decode)
            }
        })

        return { accessToken, refreshToken }

    } catch (error) {

    }
}

const authentication = asyncHandler(async (req, res, next) => {

    /**
     * 1 - check user Ud missing 
     * 2 - get access token
     * 3 - verifytoken 
     * 4 - check user in dbs
     * 5 - check keystore with this useid 
     *  6 oke return next()
     */
    // 1
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('invalid request')

    // 2
    const keysStore = await findByUseId(userId)
    if (!keysStore) throw new NotFoundError('not found key store')

    // 3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('invalid request')

    try {
        const decodeUser = JWT.verify(accessToken, keysStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError('invalid user')
        console.log(decodeUser, "key store")

        req.keysStore = keysStore
        req.user = decodeUser
        return next()
    } catch (error) {
        throw error
    }
})

const authenticationV2 = asyncHandler(async (req, res, next) => {

    /**
     * 1 - check user Ud missing 
     * 2 - get access token
     * 3 - verifytoken 
     * 4 - check user in dbs
     * 5 - check keystore with this useid 
     *  6 oke return next()
     */
    // 1
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('invalid request')

    // 2
    const keysStore = await findByUseId(userId)
    if (!keysStore) throw new NotFoundError('not found key store')
    console.log("figbug111")

    // 3
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            if (!refreshToken) throw new AuthFailureError('invalid request')
            const decodeUser = JWT.verify(refreshToken, keysStore.privateKey)
            if (userId !== decodeUser.userId) throw new AuthFailureError('invalid user')
            console.log(decodeUser, "key store")

            req.keysStore = keysStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('invalid request')

    try {
        const decodeUser = JWT.verify(accessToken, keysStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError('invalid user')
        console.log(decodeUser, "key store")

        req.keysStore = keysStore
        req.user = decodeUser
        return next()
    } catch (error) {
        throw error
    }
})
const verifyJWT = async (token, keSecret) => {
    return JWT.verify(token, keSecret)
}

module.exports = {
    createTokenPair,
    authentication,
    authenticationV2,
    verifyJWT
}