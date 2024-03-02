import mongoose,{Schema} from "mongoose"
 import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const videoSchema =new Schema(
    {
       videoFile:{
        type :String,
        required:true
       },

       thumbnail:{
        type:String,
        required :true
       },

       titel:{
        type:String,
        required :true
       },
       
       description:{
        type:String,
        required :true
       },
       
       duration:{
        type:Number,
        required :true
       },
       
       views:{
        type:Number,
        defualt :0
       },
       
       isPublished:{
        type:Boolean,
        defualt :true
       },
       
       owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
       }
    },
    {
        timeStamp:true
    }
    )

      
     videoSchema.plugin(mongooseAggregatePaginate)  
    export const Video =mongoose.model("Video",videoSchema)