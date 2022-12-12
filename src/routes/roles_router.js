import Roles from "../Model/Roles.js";
import express from "express";

const roles_router = express.Router()

roles_router.post('/create', async (req, res) => {
    const {role} = req.body

    try {
        const {id} = await Roles.create({
            role
        })
        return res.status(200).send({id})
    } catch (error) {
        return res.status(500).send(error)
    }
})

roles_router.get('/getRoles', async (req, res) => {
    try {
        const {id} = await Roles.findAll()
        return res.status(200).send({id})
    } catch (error) {
        return res.status(500).send(error)
    }
})

export default roles_router