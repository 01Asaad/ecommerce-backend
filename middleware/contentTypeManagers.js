import multer from "multer"

const fileStorage = multer.diskStorage({
    destination : (req, file, cb) => {return cb(null, "image")},
    filename : (req, file, cb) => cb(null, Date.now().toString() + "-" + file.originalname)
})
const fileFilter = (req, file, cb) => {
    if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const singleImageMiddleware = multer({storage : fileStorage, fileFilter : fileFilter}).single("image")

export {singleImageMiddleware}