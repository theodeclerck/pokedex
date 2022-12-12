import express from "express";
import config from "./config.js";
import trainerRouter from "./routes/trainer_router.js";

const app = express()
const port = config.NODE_APP_PORT

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
)
app.get("/", (req, res) => {
    res.json({ message: "ok" })
})

app.use('/trainer', trainerRouter)

app.get("*", (req, res) => {
    res.status(404).send("404 - Not found")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})