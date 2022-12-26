import bcrypt from 'bcrypt';
import express from 'express';
import Trainer from '../model/Trainer.js';
import Roles from '../model/Roles.js';
import TrainerRoles from '../model/TrainerRoles.js';
import checkAuthorization from '../middleware/checkAuthorization.js';
import isAdmin from '../middleware/isAdmin.js';

const trainerRouter = express.Router();

trainerRouter.post('/register', async (req, res) => {
  const {
    firstname,
    lastname,
    login,
    password,
    age,
  } = req.body;

  try {
    const encryptedPassword = bcrypt.hashSync(password, 5);

    const { id } = await Trainer.create({
      firstname,
      lastname,
      login,
      password: encryptedPassword,
      age,
    });

    const roles = await Roles.findOne({ where: { role: 'user' } });

    await TrainerRoles.create({
      roleId: roles.id,
      trainerId: id,
    });

    return res.status(200).send({ id });
  } catch (error) {
    return res.status(500).send(error);
  }
});

trainerRouter.get('/getTrainerInfo/self', [checkAuthorization, async (req, res) => {
  try {
    const trainer = await Trainer.findByPk(res.locals.requestor.id);
    return res.status(200).send(trainer);
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

trainerRouter.get('/getTrainerInfo/:trainerId', [checkAuthorization, async (req, res) => {
  const { trainerId } = req.params;

  try {
    const trainer = await Trainer.findByPk(trainerId);
    return res.status(200).send(trainer);
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

trainerRouter.patch('/updateLogin/self', [checkAuthorization, async (req, res) => {
  const { login } = req.body;

  try {
    const trainer = await Trainer.findByPk(res.locals.requestor.id);
    if (!trainer) return res.status(404).send('Trainer not found');

    const trainerToUpdate = { ...trainer, ...{ login } };
    const updatedTrainer = await trainer.update(trainerToUpdate);

    return res.status(200).send(updatedTrainer);
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

trainerRouter.patch('/updateLogin/:trainerId', [checkAuthorization, isAdmin, async (req, res) => {
  const { trainerId } = req.params;
  const { login } = req.body;

  try {
    const trainer = await Trainer.findByPk(trainerId);
    if (!trainer) return res.status(404).send('Trainer not found');

    const trainerToUpdate = { ...trainer, ...{ login } };
    const updatedTrainer = await trainer.update(trainerToUpdate);

    return res.status(200).send(updatedTrainer);
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

trainerRouter.delete('/delete/self', [checkAuthorization, async (req, res) => {
  try {
    const { id } = await Trainer.destroy({ where: { id: res.locals.requestor.id } });
    return res.status(200).send({ id });
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

trainerRouter.delete('/delete/:trainerId', [checkAuthorization, isAdmin, async (req, res) => {
  const { trainerId } = req.params;
  try {
    const { id } = await Trainer.destroy({ where: { id: trainerId } });
    return res.status(200).send({ id });
  } catch (error) {
    return res.status(500).send(error);
  }
}]);

export default trainerRouter;
