/*
 * Multer
 ***********/
const multer = require("multer");

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/ressources/images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        // fileSize: 1 * 1000 * 1000,
        files: 1
    },
    fileFilter: (req, file, callback) => {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/gif" ||
            file.mimetype === "image/jpeg"
        ) {
            callback(null, true)
        } else {
            callback(null, false)
            callback(new Error('Le fichier doit être au format png, jpg, jpeg ou gif.'))
        }
    }
});

module.exports = upload.single('image')
