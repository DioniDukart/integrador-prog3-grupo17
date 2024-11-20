import multer from "multer";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {//cb=callback
        cb(null, "publico");
    },
    filename: function (req, file, cb) {
        /*
        */
        let extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, crypto.randomUUID() + extension);
        //cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

export { storage };