import { DataTypes, Model } from 'sequelize';
import Database from '../database/database.js';

class TrainerRoles extends Model {
  static hasRole(trainerRoles, role) {
    return !!trainerRoles.includes(role);
  }
}

TrainerRoles.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
}, {
  sequelize: Database,
  modelName: 'trainerRoles',
  timestamps: false,
});

export default TrainerRoles;
