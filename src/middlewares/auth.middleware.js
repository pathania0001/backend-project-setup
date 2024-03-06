
//jab bhi naaya action lena ho add ,delete,comment,like,logout etc,  iss middleware ko use kr skte hain verify krne ke liye
// or return main yeh custom req dega jismain user ki informations hongi 

import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User} from "../models/user.model.js"
export const verifyJWT= asyncHandler(async(req,_,next)=>
{     
  
   try {
     const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
     //from android it will come from header ( Authorization: Bearer <token> )
 
     if(!token){
         throw new ApiError(401,"Unauthorized request")
     }
    
     const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
      
   const user=  await User.findById(decodedToken?._id).select("-password -refreshToken")
 
   if(!user){
     throw new ApiError(401,"Invalid Access Token")
   }
 
  
     req.user=user;
     next()
 
   } catch (error) {
    throw new ApiError(401,error?.message || "Invalid access token ")
   }
})

