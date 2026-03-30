import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import ChatSessionModel from "./ChatSessionsModel.js";

const ChatMessageModel = sequelize.define(
  "chat_messages",
  {
    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ChatSessionModel,
        key: "session_id",
      },
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
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
export default ChatMessageModel;
