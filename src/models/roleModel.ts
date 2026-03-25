import { DataTypes } from "sequelize";
import sequelize  from "../config/db";

const Role=sequelize.define("Role",{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    shortName:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    status:{
        type:DataTypes.TINYINT,
        defaultValue:1,
        validate:{
            isIn:[[0,1]]
        }
    }
},{
    tableName:"roles",
    timestamps:true
}
)

export default Role;


