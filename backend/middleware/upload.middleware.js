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

export const backgroundUpload = multer({
    storage,
    limits: {
        fileSize: 15 * 1024 * 1024
    },
    fileFilter
}).single("background");

const chatStorage = multer.memoryStorage();

const chatFileFilter = (req, file, cb) => {

  const allowedTypes = [

    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Недопустимый тип файла. Разрешены: изображения, PDF, TXT, DOC, DOCX, XLS, XLSX'));
  }
};

export const chatFileUpload = multer({
  storage: chatStorage,
  limits: {
    fileSize: 10 * 1024 * 1024  
  },
  fileFilter: chatFileFilter
}).single('file');