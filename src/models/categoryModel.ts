import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Category = sequelize.define("Category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  image: {
    type: DataTypes.STRING,
    allowNull: true
  },

  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    validate: {
      isIn: [[0, 1,2]]
    }
  }

}, {
  tableName: "categories",
  timestamps: true
});

export default Category;