import express from "express";
import config from "./config.js";
import trainer_router from "./routes/trainer_router.js";
import pokemon_router from "./routes/pokemon_router.js";
import roles_router from "./routes/roles_router.js"
import trainer_roles_router from "./routes/trainer_roles_router.js";

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

app.use('/trainer', trainer_router)

app.use('/pokemon', pokemon_router)

app.use('/roles', roles_router)

app.use('/trainerRoles', trainer_roles_router)

app.get("*", (req, res) => {
    res.status(404).send("404 - Not found")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})