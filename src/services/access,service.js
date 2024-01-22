'use_strict'

const bcrypt = require("bcrypt")
const crypto = require("node:crypto")
const shopModel = require('../models/shop.model')
const { createTokenPair, verifyJWT } = require("../auth/auth.Utils")
const KeyTokenServive = require("./keytoken.service")
const { getInitData } = require("../utils")
const { BadRquestError, AuthFailureError, ForbidenError } = require("../core/error.response")
const { findByEmail } = require("./shop,servince")

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
}

class AccessService {
    /**
     * 
     * @param {*} refreshToken 
     * @returns 
     */

    static handleRefeshTokenV2 = async ({ keysStore, refreshToken, user }) => {
        const { userId, email } = user

        console.log(keysStore, refreshToken, user, "logggggggggg")

        if(keysStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenServive.deleteKeyById(userId)
            throw new ForbidenError('something wrong happen !! pleas relogin')
        }

        if(keysStore.refreshToken !== refreshToken) {
            throw new AuthFailureError('shop not register 1')
        }

        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('shop not register 2')

        const tokens = await createTokenPair({ userId, email }, keysStore.publicKey, keysStore.privateKey)
        // update token
        await keysStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // da dc su dung de lay token moi
            }
        })
        return {
            user,
            tokens
        }
    }

    /**
     * check token use
     * @param {*} refreshToken 
     */

    static handleRefeshToken = async (refreshToken) => {
        const foundToken = await KeyTokenServive.findByRefreshTokenUsed(refreshToken)

        if (foundToken) {
            // decode xem may la thang nao
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({ userId, email })
            // delete token
            await KeyTokenServive.deleteKeyById(userId)
            throw new ForbidenError('something wrong happen !! pleas relogin')
        }

        // No => ngon
        const holderToken = await KeyTokenServive.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('shop not register 1')
        console.log("token fond ", holderToken)

        // verify token 
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log("----2----::", { userId, email })
        // check userId 
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('shop not register 2')
        // create 1 cap mow
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)
        // update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // da dc su dung de lay token moi
            }
        })
        return {
            user: { userId, email },
            tokens
        }
    }

    static logout = async (keysStore) => {
        const delKey = await KeyTokenServive.removeTokenById(keysStore._id)
        console.log({ delKey })
        return delKey
    }

    /**
     *  1 - check email in dbs
     *  2 -  match password
     *  3 - create AR and RT in dbs
     *  4 - generate token
     *  5  = get data return login
     * 
     * @param
     * 
     */

    static login = async ({ email, password, refreshToken = null }) => {
        // 1
        const findShop = await findByEmail({ email })
        if (!findShop) throw new BadRquestError('Shop not resgested')
        // 2
        const match = bcrypt.compare(password, findShop.password)
        if (!match) throw new AuthFailureError('authenticaton error')
        // 3
        const privateKey = crypto.randomBytes(64).toString("hex")
        const publicKey = crypto.randomBytes(64).toString("hex")
        // 4
        const { _id: userId } = findShop
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

        await KeyTokenServive.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId
        })

        return {
            shop: getInitData({ fileds: ["_id", "name", "email"], object: findShop }),
            tokens,
        }
    }

    static signUp = async ({ name, email, password }) => {

        const holderShop = await shopModel.findOne({ email }).lean()

        if (holderShop) {
            throw new BadRquestError("Error: Shop Aready resgistered")
        }


        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {
            // create privateKey and publicKey
            // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //         type: "pkcs1",
            //         format: "pem"
            //     },
            //     privateKeyEncoding: {
            //         type: "pkcs1",
            //         format: "pem"
            //     }
            // })
            const privateKey = crypto.randomBytes(64).toString("hex")
            const publicKey = crypto.randomBytes(64).toString("hex")

            console.log({ privateKey, publicKey }) // save colection key store

            const keyStore = await KeyTokenServive.createKeyToken({
                userId: newShop._id,
                publicKey: publicKey,
                privateKey: privateKey
            })

            if (!keyStore) {
                throw new BadRquestError("Error: KeyStore error")
            }
            // const publicKeyObject = crypto.createPublicKey(pulicKeyTring) level 1 advacne

            // created token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log("create token success::", tokens)
            return {
                code: 201,
                metadata: {
                    shop: getInitData({ fileds: ["_id", "name", "email"], object: newShop }),
                    tokens,
                }
            }
        }

        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService
