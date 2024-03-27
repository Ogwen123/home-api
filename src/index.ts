import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import projectInfo from "./routes/projectInfo.ts"

dotenv.config()

const app = express()
const port = 3000

//app.use(express.json())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send({
        "message": "API is running"
    })
})

app.post("/api/project_info", (req, res) => {
    projectInfo(req, res)
})

app.listen(port, "0.0.0.0")
