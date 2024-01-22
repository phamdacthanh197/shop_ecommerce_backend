"use_strict"

const { default: mongoose } = require("mongoose")
const _SECOND = 5000
const os = require('os')
const process = require('process')

// count conenct
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`numer of colelction ${numConnection}`)
}

// check overlaod connect
const checkOverload = () => {
    setInterval(() => {
        const numberOfConnection = mongoose.connections.length
        const numsCore = os.cpus().length
        const memoriesUsesage= process.memoryUsage().rss
        // example maximun number of connecton based on nume rof core
        const maxConnection = numsCore * 5

        // console.log(`Actice connection:: ${numberOfConnection}`)
        // console.log(`memory usesage:: ${memoriesUsesage / 1024 / 1024 }`)

        if(numberOfConnection > maxConnection) {
            console.log(`Connection overload detected`)
        }

    }, _SECOND); // monitor after 5 seconds
}

module.exports = {
    countConnect,
    checkOverload
}