import {Router} from "express"
import {registerUser} from "../controller/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
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

export default router