// Multer is a powerful middleware for handling multipart/form-data, commonly used for file uploads in the backend of Node.js applications.

import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {

      cb(null, file.originalname)
    // files ko destination pe shod kr 
    //bapis uska original path apne pass rakh
    }
  })

export const upload = multer({ 
    storage, 
})

