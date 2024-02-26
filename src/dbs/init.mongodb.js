"use strict"

const { default: mongoose } = require("mongoose")
const { countConnect } = require("../helpers/check.connect")
const { db: { host, name, port } } = require("../configs/config.mongodb")

const mongose_URL = `mongodb://${host}:${port}/${name}`

class DataBase {

    constructor() {
        this.connect()
    }

    // connect
    connect(type = "mongodb") {
        if (1 === 1) {
            mongoose.set("debug", true)
            mongoose.set("debug", { colro: true })
        }

        mongoose.connect(mongose_URL)
            .then(_ => console.log(`connectted to mongodb success ${mongose_URL}`, countConnect()))
            .catch(err => console.log("Error Connect!!"))
    }

    static getInstance() {
        if (!DataBase.instance) {
            DataBase.instance = new DataBase()
        }

        return DataBase.instance
    }

}

const instacneMongoDb = DataBase.getInstance()
module.exports = instacneMongoDb