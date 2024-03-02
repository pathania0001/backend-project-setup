import mongoose,{Schema} from "mongoose"

const userSchema=new Schema(
    {
username: {
    type : Stirng,
    required : true,
    unique: true,
    lowercase:true,
    trim:true,
    index:true
},
   email: {
    type : Stirng,
    required : true,
    unique: true,
    lowercase:true,
    trim:true,
    
},
fullName: {
    type : Stirng,
    required : true,
    trim:true,
    index :true
},
avatar: {
    type : Stirng,
    required : true,
},
coverimage: {
    type : Stirng,
    
},
watchHistory: {
    type : Schema.Types.ObjectId,
    ref : "Video"
    
},
password: {
    type : Stirng,
    required :[true,'Password is Required'],
    
},
refreshToken:{
    type:String
}
},
{
    timestamps:true
}
)
 
userSchema.pre("save", async function (next){
    if(!this.isModified("password"))
    return next()
    this.paasword=bcrypt.hash(this.password, 10)
    next()
})

     userSchema.methods.isPasswordCorrect =  async function (password){
        return await bcrypt.compare(password,this.password)
        //true or false
     }

     userScehma.methods.generateAccessToken=function(){
        return jwt.sign(
            {
                _id:this._id,
                email:this.email,
                username:this.username,
                fullName:this.fullName
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )
     }

     
     userScehma.methods.generateRefreshToken=function(){
        return jwt.sign(
            {
                _id:this._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )
     }

export const  User=mongoose.model("User",userSchema)
