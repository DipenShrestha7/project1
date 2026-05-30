import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config({ path: new URL("../../.env.development", import.meta.url) });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

export default sequelize;
