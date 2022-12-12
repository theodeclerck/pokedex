import {DataTypes, Model} from "sequelize";
import Database from "./Database.js";
import Pokemon from "./Pokemon.js";
import Roles from "./Roles.js";
import Trainer from "./Trainer.js";

class TrainerRoles extends Model {}

TrainerRoles.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }
},{
    sequelize: Database,
    modelName: 'trainers',
    timestamps: false,
})

Trainer.hasMany(Pokemon)

Roles.belongsToMany(Trainer, {through: TrainerRoles})
Trainer.belongsToMany(Roles, {through: TrainerRoles})

export default TrainerRoles