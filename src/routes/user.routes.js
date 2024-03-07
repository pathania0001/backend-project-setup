import {Router} from "express"
import {
         changeCuurentpassword,
         getCurrentUser, 
         getUserChannelProfile, 
         getWatchHistory, 
         loginUser, 
         logoutUser, 
         refreshAccessToken, 
         registerUser, 
         updateAccountDetials,
         updateUserAvatar, 
         updateUsercoverImage
              } from "../controller/user.controller.js"

import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/register").post(
    //register data db main upload krne se pehle hi
    //main unmain se image or avatar ko lekar store krunga multer main
    //taki cloudinary main upload kr sku 
    //it be like jane se pehle mujh se mil kr ja
    
        upload.fields([
            {
                name: "avatar",
                maxCount: 1
            }, 
            {
                name: "coverImage",
                maxCount: 1
            }
        ]),
        registerUser
        )
 
router.route("/login").post(loginUser)

//secured route

router.route("/logout").post(
       verifyJWT ,
       logoutUser)    
 //in middleware here is the use of next 
// when verify is done ab next () 
//means next method that is logoutUser ko run kro
router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT,changeCuurentpassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update-account").patch(verifyJWT,updateAccountDetials)

router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)

router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUsercoverImage)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)

router.route("/history").get(verifyJWT,getWatchHistory)







export default router