import Pokemon from "../Model/Pokemon.js";
import express from "express";
const pokemon_router = express.Router()

pokemon_router.post('/create', async (req, res) => {
    const {
        species,
        name,
        level,
        gender,
        size,
        weight,
        isShiny
    } = req.body

    try {
        const { id } = await Pokemon.create({
            species,
            name,
            level,
            gender,
            size,
            weight,
            isShiny
        })

        return res.status(200).send({id})
    } catch (error) {
        return res.status(500).send(error)
    }
})

pokemon_router.get('/getPokemons', async (req, res) => {
    try {
        const {id} = await Pokemon.findAll()
        return res.status(200).send({id})
    } catch (error) {
        return res.status(500).send(error)
    }
})

export default pokemon_router