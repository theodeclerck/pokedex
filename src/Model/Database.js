import { Sequelize } from "sequelize"
import config from "../config.js";

const Database = new Sequelize(
    config.DATABASE_NAME,
    config.DATABASE_USERNAME,
    config.DATABASE_PASSWORD,
    {
        host: config.DATABASE_HOST,
        dialect: 'mysql'
    }
);

(async () => {
    try {
        await Database.authenticate()
        await Database.sync({alter:true})
        console.log('Database is up')
    } catch (e) {
        console.error(e)
    }
})()

export default Database