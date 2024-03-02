//it is just a wrapper function we use again and again 


const  asyncHandler=(requestHandler)=>{
  return (req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
 }
}



export { asyncHandler }






//other method 

// const asyncHandler=(funs)=>{
//      async ()=>{}

//     }



// or also you can write  
//  const asyncHandler=(funcs) => async()=>{ }

// so with above use 


// const asyncHandler=(funcs)=> async(req,res,next)=>{
//     try {
        
//     } catch (error) {
//         res. status(error.code || 500).json ({
//             success: false,
//             message:error.message
//         })
//     }
// }