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
const user = require('./controllers/user')


/*
 * Import Middleware
 ***********/
const multer = require('../middleware/multer-config')


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
    .put(multer, actus.putActuSingle)
// s'il y a un middleware à ajouter c'est avant le actus.deleteOneActuSingle / ex : .get(auth, actus.getActuSingle) : auth étant un middleware

// actuCreate
router.route('/actuCreate')
    .get(actus.getActuCreate)
    .post(multer, actus.postActuCreate)


/*
 * User
 ***********/
router.route('/userCreate')
    .get(user.getUserCreate)
    .post(multer, user.postUserCreate)

router.route('/userList')
    .get(user.getUserList)

router.route('/userEdit/:id')
    .get(user.getUserEdit)
    .put(multer, user.putUserEdit)
    .delete(user.deleteOneUser)

module.exports = router
