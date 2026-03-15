import multer from "multer";

const storage = multer.memoryStorage();

const allowedTypes = /jpeg|jpg|png|gif|webp/;

const fileFilter = (req, file, cb) => {
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png, gif, webp) are allowed"));
};


export const avatarUpload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter
}).single("avatar");


