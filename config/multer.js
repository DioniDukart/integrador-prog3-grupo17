import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {//cb=callback
        cb(null, "publico");
    },
    filename: function (req, file, cb) {
        /*
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, crypto.randomUUID() + extension);
        */
        cb(null, file.originalname + '-' + Date.now());
    }
})
export { storage };