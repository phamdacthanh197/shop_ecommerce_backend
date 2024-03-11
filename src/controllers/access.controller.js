"use strict"

const AccessService = require("../services/access,service")
const { CREATED, SuccessResponse } = require('../core/success.response')

class AccessController {

    // handleRefreshToken = async (req, res, next) => {
    //     new SuccessResponse({
    //         message: "get token success",
    //         metaData: await AccessService.handleRefeshToken(req.body.refreshToken)
    //     }).send(res)
    // }

    //verison 2 fix no need token
    
    handleRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: "get token success",
            metaData: await AccessService.handleRefeshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keysStore: req.keysStore
            })
        }).send(res)
    }

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "logout success",
            metaData: await AccessService.logout(req.keysStore)
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            metaData: await AccessService.login(req.body)
        }).send(res)
    }

    signUp = async (req, res, next) => {
        console.log(req, "req")
        new CREATED({
            message: "Registered Oke!",
            metaData: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)

    }

}

module.exports = new AccessController()