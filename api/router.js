/*
 * Import
 ***********/
const express = require('express')
const router = express.Router()


/*
 * Import Controllers
 ***********/
const home = require('./controllers/home')
const actus = require('./controllers/actus')


/*
 * Import Controllers
 ***********/

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
        // fileSize: 1 * 4098 * 4098,
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

/*
 * Home
 ***********/
router.route('/')
    .get(home.get)


/*
 * Actus
 ***********/
// actus
router.route('/actus')
    .get(actus.getActu)

// actuSingle
router.route('/actuSingle/:id')
    .get(actus.getActuSingle)
    .delete(actus.deleteOneActuSingle)
    .put(upload.single('image'), actus.putActuSingle)
// s'il y a un middleware à ajouter c'est avant le actus.deleteOneActuSingle / ex : .get(auth, actus.getActuSingle) : auth étant un middleware

// actuCreate
router.route('/actuCreate')
    .get(actus.getActuCreate)
    .post(upload.single('image'), actus.postActuCreate)


module.exports = router
