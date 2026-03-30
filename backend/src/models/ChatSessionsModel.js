import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import UsersModel from "./UsersModel.js";

const ChatSessionModel = sequelize.define(
  "chat_sessions",
  {
    session_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UsersModel,
        key: "user_id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  },
);
export default ChatSessionModel;
