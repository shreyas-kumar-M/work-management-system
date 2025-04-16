import User from "../models/User.js";

export const getUserByUserId = async(req,res)=>{
    try{
        const user = await User.findByPk(req.params.id);
        if(!user) return res.status(404).json({message:"User not found"});
        res.json(user);
    }catch(err){
        res.status(500).json({message:"Error fetching user", error: err.message})
    }
}