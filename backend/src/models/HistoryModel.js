import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const HistoryModel = sequelize.define(
  "travel_history",
  {
    travel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    travel_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    review_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
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

export default HistoryModel;
