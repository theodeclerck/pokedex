import { DataTypes, Model } from 'sequelize';
import Database from '../database/database.js';

class Exchange extends Model {}

Exchange.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('waiting', 'refused', 'accepted'),
    allowNull: false,
  },
}, {
  sequelize: Database,
  modelName: 'exchanges',
  timestamps: false,
});

export default Exchange;
