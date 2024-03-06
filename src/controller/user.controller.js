
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt  from 'jsonwebtoken';


const generateAccessAndRefreshTokens = async(userId)=>
{
    try {
        const user =  await User.findById(userId)
        
       const accessToken= await user.generateAccessToken()
       const refreshToken= await user.generateRefreshToken()
    
       user.refreshToken = refreshToken
       await user.save({validateBeforeSave:false})   //for save in datatbase
      
       return {accessToken , refreshToken}

    } catch (error) {
         throw new ApiError(500,"Something went wrong while generating refresh and access token")

    }
}

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

         const loginUser = asyncHandler(async (req,res)=>{
          //req.body->data
          //username or email
          //find the user
          //password check
          //access and refresh token generation
          //send cookie
        
          const {email,username,password}=req.body;
           
          if(!username && !email)
           throw new ApiError(400,"username or email is required")

        const user=await User.findOne(
            {
             $or:[{email},{username}]
             // chahe jitne marzi {} hoon inmain se koi bhi ek mila toh  return krega user data else false
            }
         )

         if(!user)
         throw new ApiError(404,"user doesn't exist")

         const isPasswordValid= await user.isPasswordCorrect(password)
          
           if(!isPasswordValid)
             throw new ApiError(401,"password is not valid")

       const {accessToken,refreshToken}  =  await generateAccessAndRefreshTokens(user._id)

          //user ko kya kya information bhejni hai 
         
          const loggedInUser = await User.findOne(user._id).select("-password -refeshToken")
           //loggenInUser contains all information of user except password and refreshToken 
           
           const options = {
            httpOnly:true,
            secure:true
        }
            //by defualt cookies are modifiable by frontend or beckend but by above option creation for cookies make it modifiable only in backend 
            //in frontend it is only readable 
           

            return res.status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",refreshToken,options)//cookie set kr rh ehain bhejne se pehle 
            .json(
                new ApiResponse(
                200,
                {
                   user:loggedInUser,
                   accessToken,
                   refreshToken 
                },
                "User loggedIn successfully "
                )
            )
        })  
            const logoutUser = asyncHandler(async(req,res)=>{
                 
            
                await User.findByIdAndUpdate(
                    req.user._id ,
                    {
                        $set:{refreshToken:undefined}
                    }
                     )   
                   
                     const options  = {
                        httpOnly:true,
                        secure:true
                     }

                     return res
                     .status(200)
                     .clearCookie("accessToken",options)
                     .clearCookie("refreshToken",options)
                     .json( 
                        new ApiResponse(200,{},"User logged Out"))

            }) 

        const refreshAccessToken=asyncHandler(async(req,res)=>{

          try {
             const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken
  
            if(!incomingRefreshToken)
            throw new ApiError(401,"unauthorized request") 
           
            const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  
            const user=await User.findById(decodedToken?._id)
  
            if(!user)
            throw new ApiError(401,"Invalid Refresh Token")
            
            if(incomingRefreshToken!==user?.refreshToken)
            throw new ApiError(401,"Invalid User or Refresh Token is ex[ired or used")
            
            const options={
              httpOnly:true,
              secure:true
            }
            const {accessToken,newrefreshToken}=await generateAccessAndRefreshTokens(user._id)
  
           return res
           .status(200)
           .cookie("accessToken",accessToken,options)
           .cookie("refreshToken",newrefreshToken,options)
           .json(
              new ApiResponse(
                200,
                {
                  accessToken,
                  refreshToken:newrefreshToken,
                },
                "Access token refreshed"  
                
              )
           )
          } catch (error) {
            throw new ApiError(401,error?.message ||"Invalid refresh token")
          }



        })

export { registerUser,loginUser,logoutUser,refreshAccessToken} 