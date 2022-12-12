import {DataTypes, Model} from "sequelize";
import Database from "./Database.js";

class Pokemon extends Model {}

Pokemon.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    species: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(50),
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('male, female, undefined'),
        allowNull: false,
    },
    size: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    weight: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    isShiny: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    sequelize: Database,
    modelName: 'pokemons',
    timestamps: false,
})

export default Pokemon