import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import { AuditBilling } from "../modules/products/model/logTable.model";

export class DbConnecction {
  constructor() {
    dotenv.config();
  }

  connectDb() {
    try {
      const sequelize = new Sequelize({
        dialect: "mysql",
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        models: [AuditBilling],
        logging: false,
      });
      console.log("DB_ON_LINE");
      return sequelize;
    } catch (error) {
      throw error;
    }
  }
}
