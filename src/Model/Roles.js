import {DataTypes, Model} from "sequelize";
import Database from "./Database.js";
import Trainer from "./Trainer.js";
import TrainerRoles from "./TrainerRoles.js";

class Roles extends Model{}

Roles.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    role: {
        type: DataTypes.ENUM({
            values: [ 'trainer_create',
                'trainer_update',
                'trainer_delete',
                'trainer_get',
                'pokemon_create',
                'pokemon_update',
                'pokemon_delete',
                'pokemon_get' ]
        }),
        allowNull: false
    },
},{
    sequelize: Database,
    modelName: 'roles',
    timestamps: false,
})

Roles.belongsToMany(Trainer, {through: TrainerRoles})
Trainer.belongsToMany(Roles, {through: TrainerRoles})

export default Roles