import {DataTypes, Model} from "sequelize"
import Database from "./Database.js"

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
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    scope: {
        type: DataTypes.STRING(10),
        allowNull:false,
    }
}, {
    sequelize: Database,
    modelName: 'trainers',
    timestamps: false,
})

export default Trainer