import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config({ path: new URL("../../.env.development", import.meta.url) });

const databaseUrl = process.env.DATABASE_URL;
const useSsl =
  process.env.NODE_ENV === "production" ||
  /neon\.tech/i.test(databaseUrl || "") ||
  process.env.PGSSL === "true";

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});

export default sequelize;
