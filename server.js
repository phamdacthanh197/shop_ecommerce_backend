const app = require("./src/app");
const { app: { port } } = require("./src/configs/config.mongodb");

const server = app.listen(port, () => {
    console.log(`server running in port: ${port}`)
})

process.on("SIGINT", () => {
    server.close(() => console.log("sever exit"))
    // app.notify
})
