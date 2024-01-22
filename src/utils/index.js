"use strict"

const _ = require("lodash")

const getInitData = ({ fileds = [], object = {}}) => {
    return _.pick(object, fileds)
}

module.exports = {
    getInitData
}