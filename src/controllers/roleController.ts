import { Request,Response } from "express";
import Role from "../models/roleModel";
import { Op } from "sequelize";


//create 
export const createRole=async (req:Request,res:Response)=>{
    try {
        const {name,shortName}=req.body;

        if(!name || !shortName){
            return res.status(400).json({
                status:false,
                message:"Name and shortName are required",
                data:null
            });
        }

        //duplicate
        const existing=await Role.findOne({
            where:{
                [Op.or] : [{name},{shortName}]
            }
        });

        if(existing){
            return res.status(400).json({
                status:false,
                message:"Role already exists",
                data:null
            });
        }

        const role=await Role.create(req.body);

        res.status(201).json({
            status:true,
            message:"Role created successfully",
            data:role
        });
    } catch (error) {
        res.status(500).json({
            status:false,
            message:"Error creating role",
            data:null
        });
    }
};

//get all
export const getRoles= async (req:Request,res:Response)=>{
    try {
        const {page,limit,search,status}=req.query;

        if(!page && !limit && !search && status === undefined){
            const roles=await Role.findAll();
            return res.json({
                status:true,
                message:"Roles fetched successfully",
                data:roles
            })
        }

        const pageNumber =Number(page) || 1;
        const limitNumber=Number(limit) || 5;
        const offset=(pageNumber-1)*limitNumber;

        const whereCondition:any={};
        
        if(search){
            whereCondition.name={
                [Op.like]:`%${search}%`
            };
        }

        if(status!== undefined){
            if(![0,1].includes(Number(status))){
                return res.status(400).json({
                    status:false,
                    message:"Status must be 0 or 1",
                    data: null
                });
            }
            whereCondition.status=Number(status);
        }

        const result=await Role.findAndCountAll({
            where:whereCondition,
            limit:limitNumber,
            offset
        });
        res.json({
            total:result.count,
            page:pageNumber,
            totalPages:Math.ceil(result.count/limitNumber),
            data:result.rows
        });
    } catch (error) {
        res.status(500).json({
            status:false,
            message:"Error fetching roles",
            data:null
        });
    }
};

//get by id 
export const getRoleById=async(req:Request,res:Response)=>{
    try {
        const role=await Role.findByPk(Number(req.params.id) );
        if(!role){
            return res.status(404).json({
                status:false,
                message:"Role not found",
                data:null
            });
        }
        res.json({
            status:true,
            message:"Role fetched successfully",
            data:role
        });
    } catch (error) {
        res.status(500).json({
            status:false,
            message:"Error fetching role",
            data:null
        });
    }
};

//update
export const updateRole= async (req:Request,res:Response)=>{
    try {
        const id=Number(req.params.id);
        const role=await Role.findByPk(id);
        if(!role){
            return res.status(404).json({
                status:false,
                message:"Role not found",
                data:null
            })
        }

        const {name,shortName}=req.body;

        if(name||shortName){
            const existing=await Role.findOne({
                where:{
                [Op.or]:[{name},{shortName}],
                id:{[Op.ne]:id}
                }
            });
            if(existing){
                return res.status(400).json({
                    status:false,
                    message:"Role already exists",
                    data:null
                })
            }
        }
        await role.update(req.body);

        res.json({
            status:true,
            message:"Role updated successfully",
            data:role
        })
    } catch (error) {
        res.status(500).json({
            status:false,
            message:"Error updating role",
            data:null
        });
    }
}

//delete
export const deleteRole=async (req:Request,res:Response)=>{
    try {
        const id=Number(req.params.id)
        const role=await Role.findByPk(id);

        if(!role){
            return res.status(404).json({
                status:false,
                message:"Role not found",
                data:null
            });
        }
        await role.destroy();

        res.json({
            status:true,
            message:"Role deleted successfully",
            data:null
        })
    } catch (error) {
        res.status(500).json({
            status:false,
            message:"Error deleting role",
            data:null
        });
    }
}

//status
export const changeRoleStatus=async(req:Request,res:Response)=>{
    try {
        const {status}=req.body;
        if(![0,1].includes(Number(status))){
            return res.status(400).json({
                status:false,
                message:"Status must be 0 or 1",
                data:null
            });
        }
        const id =Number(req.params.id);
        const role=await Role.findByPk(id);

        if(!role){
            return res.status(404).json({
                status:false,
                message:"Role not found",
                data:null
            });
        }

        await role.update({status:Number(status)});
        res.json({
            status:true,
            message:"Role status updated successfully",
            data:role
        })
    } catch (error) {
        res.status(500).json({
            status:false,
            message:"Error updating role status",
            data:null
        });
    }
}