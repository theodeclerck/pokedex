import TrainerRoles from "../Model/TrainerRoles.js";
import express from "express";

const trainer_roles_router = express.Router()

trainer_roles_router.get('/getTrainerRoles', async (req, res) => {
    try {
        const {id} = await TrainerRoles.findAll()
        return res.status(200).send({id})
    } catch (error) {
        return res.status(500).send(error)
    }
})

export default trainer_roles_router