import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Assessment = sequelize.define("assessments", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

 enquiryId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  unique: true,
  references: {
    model: "enquiries",
    key: "id"
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
},
  status: {
    type: DataTypes.ENUM("draft", "completed"),
    defaultValue: "draft"
  },

  step1_personalInfo: {
    type: DataTypes.JSON,
    allowNull: true
  },

  step2_medicalHistory: {
    type: DataTypes.JSON,
    allowNull: true
  },

  step3_clinical: {
    type: DataTypes.JSON,
    allowNull: true
  },

  step4_careNeeds: {
    type: DataTypes.JSON,
    allowNull: true
  },

  step5_behavior: {
    type: DataTypes.JSON,
    allowNull: true
  },

  step6_endOfLife: {
    type: DataTypes.JSON,
    allowNull: true
  },

  step7_preferences: {
    type: DataTypes.JSON,
    allowNull: true
  },

  step8_finance: {
    type: DataTypes.JSON,
    allowNull: true
  }

}, {
  timestamps: true
});

export default Assessment;