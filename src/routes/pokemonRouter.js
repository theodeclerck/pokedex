import express from 'express';
import Pokemon from '../model/Pokemon.js';
import checkAuthorization from '../middleware/checkAuthorization.js';
import isAdmin from '../middleware/isAdmin.js';

const pokemonRouter = express.Router();

pokemonRouter.post('/add/self', [checkAuthorization, async (req, res) => {
  const {
    species,
    name,
    level,
    gender,
    size,
    weight,
    isShiny,
  } = req.body;

  try {
    const { id } = await Pokemon.create({
      species,
      name,
      level,
      gender,
      size,
      weight,
      isShiny,
      trainerId: res.locals.requestor.id,
    });

    return res.status(200).send({ id });
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

pokemonRouter.post('/add/:trainerId', [checkAuthorization, isAdmin, async (req, res) => {
  const {
    species,
    name,
    level,
    gender,
    size,
    weight,
    isShiny,
  } = req.body;

  const { trainerId } = req.params;

  try {
    const { id } = await Pokemon.create({
      species,
      name,
      level,
      gender,
      size,
      weight,
      isShiny,
      trainerId,
    });

    return res.status(200).send({ id });
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

pokemonRouter.get('/getPokemons/self', [checkAuthorization, async (req, res) => {
  try {
    const { id } = await Pokemon.findAll({ where: { trainerId: res.locals.requestor.id } });
    return res.status(200).send({ id });
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

pokemonRouter.get('/getPokemons/:trainerId', [checkAuthorization, async (req, res) => {
  const { trainerId } = req.params;
  try {
    const { id } = await Pokemon.findAll({ where: { trainerId } });
    return res.status(200).send({ id });
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

pokemonRouter.delete('/release/self', [checkAuthorization, async (req, res) => {
  const { id } = req.body;
  try {
    const pokemon = await Pokemon.findByPk(id);
    if (pokemon.trainerId === res.locals.requestor.id) {
      await Pokemon.destroy({ where: { id } });
      return res.status(200).send('account deleted');
    } return res.status(401).send('this is not your pokemon!');
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

pokemonRouter.delete('/release/:trainerId', [checkAuthorization, isAdmin, async (req, res) => {
  const { trainerId } = req.params;
  const { id } = req.body;
  try {
    const pokemon = await Pokemon.findByPk(id);
    if (pokemon.trainerId === trainerId) {
      await Pokemon.destroy({ where: { id } });
      return res.status(200).send('account deleted');
    } return res.status(401).send('the trainer don\'t own this pokemon');
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

pokemonRouter.patch('/rename/self', [checkAuthorization, async (req, res) => {
  const { name, id } = req.body;

  try {
    const pokemon = await Pokemon.findByPk(id);
    if (!pokemon) return res.status(404).send('Pokemon not found');

    if (pokemon.trainerId === res.locals.requestor.id) {
      const pokemonToUpdate = { ...pokemon, ...{ name } };
      const updatedPokemon = await pokemon.update(pokemonToUpdate);

      return res.status(200).send(updatedPokemon);
    } return res.status(401).send('this is not your pokemon!');
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

pokemonRouter.patch('/rename/:trainerId', [checkAuthorization, isAdmin, async (req, res) => {
  const { name, id } = req.body;

  const { trainerId } = req.params;

  try {
    const pokemon = await Pokemon.findByPk(id);
    if (!pokemon) return res.status(404).send('Pokemon not found');

    if (pokemon.trainerId === trainerId) {
      const pokemonToUpdate = { ...pokemon, ...{ name } };
      const updatedPokemon = await pokemon.update(pokemonToUpdate);

      return res.status(200).send(updatedPokemon);
    } return res.status(401).send('the trainer don\'t own this pokemon');
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

pokemonRouter.patch('/levelUp/:trainerId', [checkAuthorization, isAdmin, async (req, res) => {
  const { trainerId } = req.params;
  const { level, pokemonId } = req.body;

  try {
    const pokemon = await Pokemon.findByPk(pokemonId);
    if (!pokemon) return res.status(404).send('Pokemon not found');

    if (pokemon.trainerId === trainerId) {
      const newLevel = level + 1;
      const pokemonToUpdate = { ...pokemon, ...{ level: newLevel } };
      const updatedPokemon = await pokemon.update(pokemonToUpdate);

      return res.status(200).send(updatedPokemon);
    } return res.status(401).send('the trainer don\'t own this pokemon');
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

export default pokemonRouter;
