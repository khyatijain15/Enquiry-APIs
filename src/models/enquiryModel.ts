import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Enquiry = sequelize.define("Enquiry", {

  caller_name: { type: DataTypes.STRING, allowNull: false },
  contact_number: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  date_of_call: { type: DataTypes.DATE },
  relationship: { type: DataTypes.STRING },
  caller_address: { type: DataTypes.TEXT },

  resident_name: { type: DataTypes.STRING, allowNull: false },
  dob: { type: DataTypes.DATE },
  hsc_number: { type: DataTypes.STRING },
  current_location: { type: DataTypes.STRING },
  current_address: { type: DataTypes.TEXT },
  source: { type: DataTypes.STRING },

  methods: { type: DataTypes.JSON },

  diagnosis: { type: DataTypes.TEXT },
  mobility: { type: DataTypes.STRING },
  care_needs: { type: DataTypes.TEXT },
  medications: { type: DataTypes.TEXT },

  placement_type: { type: DataTypes.STRING },
  preferred_location: { type: DataTypes.STRING },
  urgency: { type: DataTypes.STRING },

  categories: { type: DataTypes.JSON }

}, {
  tableName: "enquiries",
  timestamps: false
});

export default Enquiry;