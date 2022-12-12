import {DataTypes, Model} from "sequelize";
import Database from "./Database.js";

class Roles extends Model{}

Roles.init({
    id: {
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
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
},{
    sequelize: Database,
    modelName: 'Roles',
    timestamps: false,
})

export default Roles