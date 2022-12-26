import { DataTypes, Model } from 'sequelize';
import Database from '../database/database.js';
import Client from './Client.js';

class ClientCode extends Model {}

ClientCode.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  authorization_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize: Database,
  modelName: 'clientCode',
  timestamps: false,
});

Client.hasMany(ClientCode, { foreignKey: Client.id });

export default ClientCode;
