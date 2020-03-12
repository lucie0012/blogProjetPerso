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
const repertory = require('./controllers/repertory')
const contact = require('./controllers/contact')
const about = require('./controllers/about')
const user = require('./controllers/user')
const admin = require('./controllers/admin')


/*
 * Import Middleware
 *******************/
const multer = require('../middleware/multer-config')
const isAdmin = require('../middleware/isAdmin')
const preMulter = require('../middleware/preMulter')

/*
 * dbUser
 *******************/
// const userCollection = require('./database/models/userModel')
// router.get('*', async (req, res, next) => {
//     const dbUser = await userCollection.findById(req.session.userId)
//     next({dbUser})
// })

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
    // .get(actus.getActuCreate)
    .post(multer, actus.postActuCreate)



/*
 * Comment
 ***********/
router.route('/commentaireActu/:id')
    .post(actus.postActuComment)
    .put(actus.putActuComment)
    .delete(actus.deleteOneComment)



/*
 * Répertoire
 ****************/
// Affichage page répertoire et création site/répertoire
router.route('/repertory')
    .get(repertory.getRepertory)
    .post(repertory.postSiteCreate)

// Edition de site/répertoire 
router.route('/repertory/:id')
    .put(repertory.putSite)
    .delete(repertory.deleteOneSite)

// Validation de site/répertoire
router.route('/repertoryValid/:id')
    .put(repertory.putSiteValid)


/*
 *Note
 ****************/
// Création de note/commentaire
router.route('/note/:id')
    .post(repertory.postNote)
    .put(repertory.putNoteValid)
    .delete(repertory.deleteOneNote)


/*
 * Contact
 ************/
// Affichage page contact et envoi message
router.route('/contact')
    .get(contact.getContact)
    .post(contact.postMessage)

// Suppression d'un message
router.route('/contact/:id')
    .delete(contact.deleteOneMessage)



/*
 * About
 ***********/
router.route('/about')
    .get(about.getAbout)



/*
 * User
 ***********/
// Création de compte
router.route('/userCreate')
    // .get(user.getUserCreate)
    .post(preMulter, multer, user.postUserCreate)

// Connexion
router.route('/authentification')
    // .get(user.getUserAuth)
    .post(user.postUserAuth)

// // Listing (temporaire car pour accéder au compte)
// router.route('/userListing')
//     .get(user.getUserListing)

// Affichage compte
router.route('/userSingle/:id')
    .get(user.getUserSingle)

// Gestion compte
router.route('/userEdit/:id')
    // .get(user.getUserEdit)
    .put(multer, user.putUserEdit)
    .delete(user.deleteOneUser)

// Déconnexion
router.route('/userLogOut')
    .get(user.getLogOut)



/*
 * Admin
 ***********/
// Affichage page admin
router.route('/admin')
    .get(isAdmin, admin.getAdmin)

// Liste d'utilisateur
router.route('/adminUserList')
    .get(isAdmin, admin.getUserList)

// Editition utilisateur en isVerified
router.route('/verifiedUser/:id')
    .put(isAdmin, admin.putVerifiedUser)

// Gestion des utilisateurs
router.route('/adminUserEdit/:id')
    .get(isAdmin, admin.getUserEdit)
    .put(isAdmin, admin.putlistUser)
    .delete(isAdmin, admin.deleteOneUser)

module.exports = router
