
//setting server
import app from "./app";
import sequelize from "./config/db";
import dotenv from "dotenv";


import "./models/userModel";
import "./models/categoryModel";
import "./models/enquiryModel";
import "./models/roleModel";
import "./models/assessmentModel"; 

dotenv.config();

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(async () => {
    console.log("DB Connected");

  
    await sequelize.sync({ alter: true });

    console.log("All models synced");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => console.error("DB Error:", err));