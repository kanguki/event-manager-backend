const multer = require('multer')
const path = require('path')

module.exports = {
    storage : multer.diskStorage({
        destination: path.resolve(__dirname,"..","..","files"),
        filename: (req, file, cb) => {
            const extention = path.extname(file.originalname)
            const name = path.basename(file.originalname, extention)  
            //if there is any space in the name of the file, it will not work
            //i.e `   ${name.replace(/\s/g,"")}-${Date.now()}${extention}    ` is invalid
            cb(null,`${name.replace(/\s/g,"")}-${Date.now()}${extention}`) //=>eg: abc-2020.png
        },
      })
      
}