import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_XvNtc6Df5GSq@ep-plain-cake-aoqe1xw2-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  {
    dialect: "postgres",
  },
);

export default sequelize;
