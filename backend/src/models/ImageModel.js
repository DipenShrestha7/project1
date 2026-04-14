import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const ImageModel = sequelize.define(
  "images",
  {
    image_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  },
);

export default ImageModel;
