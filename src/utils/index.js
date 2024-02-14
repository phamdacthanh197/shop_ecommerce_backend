"use strict"

const _ = require("lodash")

const getInitData = ({ fileds = [], object = {} }) => {
    return _.pick(object, fileds)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

// remvoe underfind object 
const removeUndefinedObject = (object) => {
    Object.keys(object).forEach(key => {
        if (object[key] == undefined || object[key] == null) delete object[key]
    })
    return object
}   

const updateNesttedObject = (object) => {
    console.log("1::", object)
    const final = {}
    Object.keys(object).forEach(key => {
    console.log("3::", key)
        if(typeof object[key] === 'object' && !Array.isArray(object[key])) {
            const response = updateNesttedObject(object[key])
            Object.keys(response).forEach(a => {
                console.log("4::", a)
                final[`${key}.${a}`] = response[a]
            })
        } else {
            final[key] = object[key]
        }
    })
    console.log("2::", final)
    return final
}

module.exports = {
    getInitData,
    getUnSelectData,
    removeUndefinedObject,
    updateNesttedObject,
    getSelectData
}