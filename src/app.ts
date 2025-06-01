import express from "express"
import cors from "cors"
import router from "./app/routes/router"
import { globalErrorHandler } from "./app/middleware"
import { morganStream } from "./app/logger"
import morgan from "morgan"
const app = express()

app.use(cors({
    origin: "*",
    credentials: true
}))
app.use(morgan('combined', { stream: morganStream }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/v1", router)
app.use(globalErrorHandler)
app.get("/", (req, res) => {
    res.json({
        statusCode: 200,
        success: true,
        message: "Remote tribe APIs"
    })
})
export default app