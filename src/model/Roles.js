import { DataTypes, Model } from 'sequelize';
import Database from '../database/database.js';

class Roles extends Model {}

Roles.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  sequelize: Database,
  modelName: 'roles',
  timestamps: false,
});

(async () => {
  await Roles.sync({ alter: true });
  try {
    if ((await Roles.findAll()).length === 0) {
      await Roles.bulkCreate([
        { role: 'trainer_create_self' },
        { role: 'trainer_create_others' },
        { role: 'trainer_update_self' },
        { role: 'trainer_update_others' },
        { role: 'trainer_delete_self' },
        { role: 'trainer_delete_others' },
        { role: 'trainer_get' },
        { role: 'pokemon_add' },
        { role: 'pokemon_update_self' },
        { role: 'pokemon_update_others' },
        { role: 'pokemon_release' },
        { role: 'pokemon_get' },
        { role: 'trainer_roles_update' },
        { role: 'trainer_roles_get' },
        { role: 'user' },
        { role: 'admin' },
      ]);
    }
  } catch (e) {
    console.log(e);
  }
})();

export default Roles;
