import Trainer from '../model/Trainer.js';
import TrainerRoles from '../model/TrainerRoles.js';
import Roles from '../model/Roles.js';

const isAdmin = async (req, res, next) => {
  try {
    const trainer = await Trainer.findByPk(res.locals.requestor.id);
    const trainerRoles = await TrainerRoles.findAll({ attributes: ['roleId'], where: { trainerId: trainer.id } });
    const role = await Roles.findByPk(trainerRoles[0].roleId);
    if (!trainer || !trainerRoles) {
      return res.status(404).send('User not found');
    }

    if (!TrainerRoles.hasRole(role.role, 'admin')) {
      return res.status(403).send({ error: "You don't have the privilege to do this action" });
    }
    next();
  } catch (e) {
    return res.status(500).send(e);
  }
};

export default isAdmin;
