const compression = require("compression")
const express = require("express")
const { default: helmet } = require("helmet")
const morgan = require("morgan")
const { countConnect, checkOverload } = require("./helpers/check.connect")
const router = require("./routes")
const app = express()
require("dotenv").config()// app.use(morgan("combined"))


//init midle ware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true,
}))
// app.use(morgan("common"))
// app.use(morgan("short"))
// app.use(morgan("tiny"))
// init db
require("./dbs/init.mongodb")
countConnect()
checkOverload()
// init routes
app.use("", router)

// handling error
app.use((req, res, next) => {
    const error = new Error('not found')
    error.status = 404
    next(error)
})

app.use((error,req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        stack: error.stack,
        message: error.message || "internal error"
    })
})


module.exports = app