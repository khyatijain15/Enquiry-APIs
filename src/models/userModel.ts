import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import Role from "../models/roleModel";

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    role_id: {
      type: DataTypes.INTEGER,
      allowNull:false
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status:{
      type:DataTypes.TINYINT,
      defaultValue:1,
      validate:{
        isIn:[[0,1,2]]
      }
    }
  },
  {
    timestamps: false
  }
);

User.belongsTo(Role, { foreignKey: "role_id" });
export default User;