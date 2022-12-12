import Trainer from "../Model/Trainer.js";
//import bcrypt from "bcrypt";
import express from "express";
const trainer_router = express.Router()

trainer_router.post('/create', async (req, res) => {
    const {
        firstname,
        lastname,
        login,
        password,
        age,
    } = req.body

    try {
        const { id } = await Trainer.create({
            firstname,
            lastname,
            login,
            password,
            age,
        })

        return res.status(200).send({id})
    } catch (error) {
        return res.status(500).send(error)
    }
})

trainer_router.get('/getTrainers', async (req, res) => {
    const {

    } = req.body
})

export default trainer_router