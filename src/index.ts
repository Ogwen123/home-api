import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"
import projectInfo from "./routes/projectInfo.ts"

dotenv.config()

const app = express()
const port = 3000

//app.use(express.json())
app.use(bodyParser.json())

const headers = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, token",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json"
}

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PATCH,DELETE,OPTIONS")
    res.header("Access-Control-Max-Age", "86400")
    next();
});

app.get('/', (req, res) => {
    res.send({
        "message": "API is running"
    })
})

app.post("/api/project_info", (req, res) => {
    projectInfo(req, res)
})

app.listen(port, "0.0.0.0", () => {
    console.log("loaded")
})
