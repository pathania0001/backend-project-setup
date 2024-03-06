import mongoose from "mongoose";

const subscriptionSchema = new Schema({
 subscriber: {    // one to who is subscribing
    type : Schema.Types.ObjectId,
    ref: "User"
 },
 channel: {    //one to whom "subscriber" is subscribing
    type : Schema.Types.ObjectId,
    ref: "User"
 },
},
{
    timestams:true
})


export const Subscription = mongoose.model("Subscription",subscriptionSchema)