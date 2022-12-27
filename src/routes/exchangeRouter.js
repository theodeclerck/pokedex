import express from 'express';
import Exchange from '../model/Exchange.js';
import checkAuthorization from '../middleware/checkAuthorization.js';
import isAdmin from '../middleware/isAdmin.js';
import Pokemon from '../model/Pokemon.js';
import Trainer from "../model/Trainer.js";

const exchangeRouter = express.Router();

exchangeRouter.post('/create/self', [checkAuthorization, async (req, res) => {
  const {
    receiverId,
    senderPokemonId,
    receiverPokemonId,
  } = req.body;

  try {
    if ((await Exchange.findAll({
      where: {
        senderId: res.locals.requestor.id,
        receiverId,
        senderPokemonId,
        receiverPokemonId,
      },
    })).length !== 0) return res.status(400).send('exchange already exist');
    const receiver = await Trainer.findByPk(receiverId)
    if (!receiver) return res.status(404).send('trainer not found')
    if (res.locals.requestor.id === receiverId) return res.status(400).send('sender and receiver cannot be the same');
    const senderPokemon = await Pokemon.findByPk(senderPokemonId);
    if (!senderPokemon) return res.status(404).send('pokemon does not exist');
    if (senderPokemon.trainerId !== res.locals.requestor.id) return res.status(400).send('the sender does not own this pokemon');
    const receiverPokemon = await Pokemon.findByPk(receiverPokemonId);
    if (!receiverPokemon) return res.status(404).send('pokemon does not exist');
    if (receiverPokemon.trainerId !== receiverId) return res.status(400).send('the receiver does not own this pokemon');
    const { id } = await Exchange.create({
      status: 'waiting',
      senderId: res.locals.requestor.id,
      receiverId,
      senderPokemonId,
      receiverPokemonId,
    });
    return res.status(201).send(id);
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

exchangeRouter.post('/create/:trainerId', [checkAuthorization, isAdmin, async (req, res) => {
  const {
    receiverId,
    senderPokemonId,
    receiverPokemonId,
  } = req.body;

  const { trainerId } = req.params;

  try {
    if ((await Exchange.findAll({
      where: {
        senderId: trainerId,
        receiverId,
        senderPokemonId,
        receiverPokemonId,
      },
    })).length !== 0) return res.status(400).send('exchange already exist');
    if (trainerId === receiverId) return res.status(400).send('sender and receiver cannot be the same');
    const senderPokemon = await Pokemon.findByPk(senderPokemonId);
    const receiverPokemon = await Pokemon.findByPk(receiverPokemonId);
    if (!senderPokemon) return res.status(404).send('pokemon does not exist');
    if (senderPokemon.trainerId.toString() !== trainerId) return res.status(400).send('the sender does not own this pokemon');
    if (!receiverPokemon) return res.status(404).send('pokemon does not exist');
    if (receiverPokemon.trainerId !== receiverId) return res.status(400).send('the receiver does not own this pokemon');
    const { id } = await Exchange.create({
      status: 'waiting',
      senderId: trainerId,
      receiverId,
      senderPokemonId,
      receiverPokemonId,
    });
    return res.status(201).send(id);
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

exchangeRouter.get('/getSentExchanges/self', [checkAuthorization, async (req, res) => {
  try {
    const exchange = await Exchange.findAll({ where: { senderId: res.locals.requestor.id } });
    return res.status(200).send(exchange);
  } catch (e) {
    return res.status(500).send(e);
  }
}]);

exchangeRouter.get('/getSentExchanges/:trainerId', [checkAuthorization, isAdmin, async (req, res) => {
  const { trainerId } = req.params;

  try {
    const exchange = await Exchange.findAll({ where: { senderId: trainerId } });
    return res.status(200).send(exchange);
  } catch (e) {
    return res.status(500).send(e);
  }
}]);

exchangeRouter.get('/getReceivedExchanges/self', [checkAuthorization, async (req, res) => {
  try {
    const exchange = await Exchange.findAll({ where: { receiverId: res.locals.requestor.id } });
    return res.status(200).send(exchange);
  } catch (e) {
    return res.status(500).send(e);
  }
}]);

exchangeRouter.get('/getReceivedExchanges/:trainerId', [checkAuthorization, isAdmin, async (req, res) => {
  const { trainerId } = req.params;

  try {
    const exchange = await Exchange.findAll({ where: { receiverId: trainerId } });
    return res.status(200).send(exchange);
  } catch (e) {
    return res.status(500).send(e);
  }
}]);

exchangeRouter.patch('/sendResponse', [checkAuthorization, async (req, res) => {
  const { status, id } = req.body;

  try {
    const exchange = await Exchange.findByPk(id);
    if (!exchange) return res.status(404).send('exchange does not exist');
    if (exchange.status !== 'waiting') return res.status(400).send('exchange is no more available');

    const exchangeToUpdate = { ...exchange, ...{ status } };
    const updatedExchange = await exchange.update(exchangeToUpdate);
    if (status === 'accepted') {
      const senderTrainerPokemon = await Pokemon.findByPk(exchange.senderPokemonId);
      const receiverTrainerPokemon = await Pokemon.findByPk(exchange.receiverPokemonId);

      if (!senderTrainerPokemon) return res.status(404).send('the pokemon to send is not valid');
      if (!receiverTrainerPokemon) return res.status(404).send('the pokemon to receive is not valid');

      const senderTrainerPokemonToUpdate = {
        ...senderTrainerPokemon,
        ...{ trainerId: exchange.receiverId },
      };
      await senderTrainerPokemon.update(senderTrainerPokemonToUpdate);

      const receiverTrainerPokemonToUpdate = {
        ...receiverTrainerPokemon,
        ...{ trainerId: exchange.senderId },
      };
      await receiverTrainerPokemon.update(receiverTrainerPokemonToUpdate);
    }
    return res.status(200).send(updatedExchange);
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

export default exchangeRouter;
