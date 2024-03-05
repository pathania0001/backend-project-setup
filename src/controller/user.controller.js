
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

//asyncHandler for error chaecking in request
//if not having any error return res.st........
//otherwise we have handle thr promise every time


const registerUser= asyncHandler(async (req,res) =>{
       //get user  details from frontend
       //validation -not empty
       //check if user already exists: username & email
       //check for image ,check for avatar
       //upload them to cloudinary ,avatar
       //create user object - create entry in db
       // remove password and refesh token filef frim response 
       //check for user creation 
       //return res


       const {fullName,email,username,password}=req.body

      
       if([fullName,email,username,password].some((field)=>field?.trim()===""
       ))
           {
              throw new ApiError(400,"All fields are  required")
              } 

              //you can valid email by email.find(@   like that)


              // now check for already existed user by email or by username
       const existedUser = await User.findOne({
             $or:[{email} , {username}] 
             //$or:[{},{},{}...]  if any one is true existedUser is true
        })

        if(existedUser)
        {
              throw new ApiError(409, "User with email or username already existed")
        }

        const avatarLocalPath =req.files?.avatar[0]?.path;

      //   const coverImageLocalPath=req.files?.coverImage[0]?.path; 
       //the above code is fail when  coverImage is not there  
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
        if(!avatarLocalPath)
        throw new ApiError(400,"Avatar file is required")
       
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
     if(!avatar)
        throw new ApiError(400,"Avatar and coverImage files are required")
      
        const user= await User.create({
                   
               fullName,
               avatar: avatar.url,
               coverImage: coverImage?.url || "",
               email,
               password,
               username: username.toLowerCase(),
       
                     })
     
       const createdUser= await User.findById(user._id).select(
              "-password -refreshToken"
              // (-) means no need
       )

       if(!createdUser)
        throw new ApiError(500,"Something went wrong while regstering the user")

           
        return res.status(201).json(
            new ApiResponse(200,createdUser, "User registered Successfully"))
        
    
           
})

export { registerUser } 