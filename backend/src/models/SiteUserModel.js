import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const UsersModel = sequelize.define(
  "site_users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "site_users", key: "id" },
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default UsersModel;
