import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"
import projectInfo from "./routes/projectInfo.ts"
import { prisma } from "./utils/db.ts"
import { error } from "./utils/api.ts"

dotenv.config()

const app = express()
const port = 3003

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

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PATCH,DELETE,OPTIONS")
    res.header("Access-Control-Max-Age", "86400")
    next();
});

app.use("/api/", async (req, res, next) => {
    let enabled
    const enabledRes = (await prisma.services.findUnique({
        where: {
            id: "d795fae3-579d-4f89-a798-3bae523972d2"
        },
        select: {
            enabled: true
        }
    }))

    if (enabledRes === undefined || enabledRes === null) {
        enabled = true
    } else {
        enabled = enabledRes.enabled
    }

    //console.log(enabledRes)

    //console.log(enabled)
    if (enabled) {
        next();
    } else {
        error(res, 403, "This service is disabled.")
    }
});

app.get('/', async (req, res) => {
    const enabled = (await prisma.services.findUnique({
        where: {
            id: "abc3d324-9055-4cb5-8c3e-34a3da32b847"
        },
        select: {
            enabled: true
        }
    }))?.enabled

    res.send({
        "message": (enabled ? "API is running!" : "API is disabled!")
    })
})

app.post("/api/project-info", (req, res) => {
    projectInfo(req, res)
})

app.listen(port, "0.0.0.0", () => {
    console.log("loaded")
})
