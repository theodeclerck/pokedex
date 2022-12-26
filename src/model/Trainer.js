import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import Database from '../database/database.js';
import Pokemon from './Pokemon.js';
import TrainerRoles from './TrainerRoles.js';
import Roles from './Roles.js';
import ClientCode from './ClientCode.js';
import Exchange from './Exchange.js';

class Trainer extends Model {}

Trainer.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  firstname: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  login: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique:true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  sequelize: Database,
  modelName: 'trainers',
  timestamps: false,
});

(async () => {
  await Trainer.sync({ alter: true });
  await Pokemon.sync({ alter: true });
  await Exchange.sync({ alter: true });
  await ClientCode.sync({ alter: true });
  await TrainerRoles.sync({ alter: true });

  // create the first trainer Leo and set him as admin
  try {
    if ((await Trainer.findAll()).length === 0) {
      const encryptedPassword = bcrypt.hashSync('synthia', 5);

      const trainer = await Trainer.create({
        firstname: 'Leo',
        lastname: 'Pokemaniac',
        login: 'leopkmn',
        password: encryptedPassword,
        age: '1999-10-08',
      });

      const admin = await Roles.findOne({ where: { role: 'admin' } });

      await TrainerRoles.create({
        roleId: admin.id,
        trainerId: trainer.id,
      });
    }
  } catch (e) {
    console.log(e);
  }
})();

Trainer.hasMany(Pokemon, { foreignKey: Pokemon.id, onDelete: 'CASCADE'});
Roles.belongsToMany(Trainer, { through: TrainerRoles });
Trainer.belongsToMany(Roles, { through: TrainerRoles });
Trainer.hasMany(Exchange, { foreignKey: 'senderId', onDelete: 'CASCADE', onUpdate: 'RESTRICT' });
Trainer.hasMany(Exchange, { foreignKey: 'receiverId', onDelete: 'CASCADE' });
Pokemon.hasOne(Exchange, { foreignKey: 'senderPokemonId', onDelete: 'CASCADE' });
Pokemon.hasOne(Exchange, { foreignKey: 'receiverPokemonId', onDelete: 'CASCADE' });

export default Trainer;
