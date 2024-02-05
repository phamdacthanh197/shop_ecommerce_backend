"use strict"

const _ = require("lodash")

const getInitData = ({ fileds = [], object = {}}) => {
    return _.pick(object, fileds)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

module.exports = {
    getInitData,
    getUnSelectData,
    getSelectData
}