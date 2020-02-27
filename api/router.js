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
const admin = require('./controllers/admin')


/*
 * Import Middleware
 ***********/
const multer = require('../middleware/multer-config')
const isAdmin = require('../middleware/isAdmin')


/*
 * Home
 ***********/
router.route('/')
    .get(home.getHome)


/*
 * Actus
 ***********/
// Affichage de toutes les actualités
router.route('/actus')
    .get(actus.getActu)

// Affichage et gestion actus single
router.route('/actuSingle/:id')
    .get(actus.getActuSingle)
    .delete(actus.deleteOneActuSingle)
    .put(multer, actus.putActuSingle)
// s'il y a un middleware à ajouter c'est avant le actus.deleteOneActuSingle / ex : .get(auth, actus.getActuSingle) : auth étant un middleware

// Création d'actu
router.route('/actuCreate')
    .get(actus.getActuCreate)
    .post(multer, actus.postActuCreate)


/*
 * User
 ***********/
// Création de compte
router.route('/userCreate')
    .get(user.getUserCreate)
    .post(multer, user.postUserCreate)

// Connexion
router.route('/authentification')
    .get(user.getUserAuth)
    .post(user.postUserAuth)

// Listing (temporaire car pour accéder au compte)
router.route('/userListing')
    .get(user.getUserListing)

// Affichage compte
router.route('/userSingle/:id')
    .get(user.getUserSingle)

// Gestion compte
router.route('/userEdit/:id')
    .get(user.getUserEdit)
    .put(multer, user.putUserEdit)
    .delete(user.deleteOneUser)

// Déconnexion
router.route('/userLogOut')
    .get(user.getLogOut)


/*
 * Admin
 ***********/
// Liste d'utilisateur
router.route('/adminUserList')
    .get(isAdmin, admin.getUserList)

// Gestion des utilisateurs
router.route('/adminUserEdit/:id')
    .get(isAdmin, admin.getUserEdit)
    .put(admin.putlistUser)
    .delete(admin.deleteOneUser)

module.exports = router
