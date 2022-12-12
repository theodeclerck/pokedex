import {DataTypes, Model} from "sequelize";
import Database from "./Database.js";

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

export default TrainerRoles