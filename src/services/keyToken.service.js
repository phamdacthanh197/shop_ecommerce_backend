'use strict'

const { Types } = require("mongoose")
const keytokenModel = require("../models/keytoken.model")

class KeyTokenServive {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // level 0
            // const publickKeyString = publicKey.toString()
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey
            // })

            // console.log(tokens, "key token")
            // return tokens ? tokens.publicKey : null


            // level xxx
            const filter = { user: userId },
                update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
                options = { upsert: true, new: true }

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }
    static findByUseId = async (userId) => {
        return await keytokenModel.findOne({ user: userId })
    }

    static removeTokenById = async (id) => {
        return await keytokenModel.deleteOne({ _id: id }).lean()
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken })
    }

    static deleteKeyById = async (userId) => {
        return await keytokenModel.deleteOne({ user: userId })
    }

    static d
}

module.exports = KeyTokenServive