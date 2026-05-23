import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/projectdb",
  {
    dialect: "postgres",
  },
);

export default sequelize;
