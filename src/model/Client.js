import { DataTypes, Model } from 'sequelize';
import Database from '../database/database.js';

class Client extends Model {}

Client.init({
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  secret: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: Database,
  modelName: 'clients',
  timestamps: false,
});

(async () => {
  await Client.sync({ alter: true });

  try {
    if ((await Client.findAll()).length === 0) {
      await Client.create({
        id: 'client1',
        secret: 'test',
      });
    }
  } catch (e) {
    console.log(e);
  }
})();

export default Client;
