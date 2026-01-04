import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "postgres://postgres:postgres@localhost:5432/projectDB",
  {
    dialect: "postgres",
  }
);

export default sequelize;
