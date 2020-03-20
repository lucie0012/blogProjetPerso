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
const isVerified = require('../middleware/isVerified')
// const preMulter = require('../middleware/preMulter')

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
// Affichage des actus et création d'actu
router.route('/actus')
    .get(actus.getActu)
    .post(isAdmin, multer, actus.postActuCreate)

// Affichage, gestion et suppression actus single
router.route('/actuSingle/:id')
    .get(actus.getActuSingle)
    .delete(isAdmin, actus.deleteOneActuSingle)
    .put(isAdmin, multer, actus.putActuSingle)
// s'il y a un middleware à ajouter c'est avant le actus.deleteOneActuSingle / ex : .get(auth, actus.getActuSingle) : auth étant un middleware



/*
 * Comment
 ***********/
// Création, validation et suppression
router.route('/commentaireActu/:id')
    .post(isVerified, actus.postActuComment)
    .put(isAdmin, actus.putActuComment)
    .delete(isAdmin, actus.deleteOneComment)



/*
 * Répertoire
 ****************/
// Affichage page répertoire et création site/répertoire
router.route('/repertory')
    .get(repertory.getRepertory)
    .post(isVerified, multer, repertory.postSiteCreate)

// Filtre par catégorie
router.route('/repertoryFilter')
    .post(repertory.postSiteFilter)

// Edition de site/répertoire et suppression
router.route('/repertory/:id')
    .put(isAdmin, multer, repertory.putSite)
    .delete(isAdmin, repertory.deleteOneSite)

// Validation de site/répertoire
router.route('/repertoryValid/:id')
    .put(isAdmin, repertory.putSiteValid)


    
/*
 *Note
 ****************/
// Création, validation et suppression de note/commentaire
router.route('/note/:id')
    .post(isVerified, repertory.postNote)
    .put(isAdmin, repertory.putNoteValid)
    .delete(isAdmin, repertory.deleteOneNote)



/*
 * Contact
 ************/
// Affichage page contact et envoi message
router.route('/contact')
    .get(contact.getContact)
    .post(contact.postMessage)

// Suppression d'un message
router.route('/contact/:id')
    .delete(isAdmin, contact.deleteOneMessage)



/*
 * About
 ***********/
// Affichage page a propos
router.route('/about')
    .get(about.getAbout)



/*
 * User
 ***********/
// Création de compte
router.route('/userCreate')
    .post(multer, user.postUserCreate)

// Connexion
router.route('/authentification')
    .post(user.postUserAuth)

// Gestion compte (édition et suppression)
router.route('/userEdit/:id')
    .put(multer, user.putUserEdit)
    .delete(user.deleteOneUser)

// Déconnexion
router.route('/userLogOut')
    .get(user.getLogOut)

// Edition utilisateur en isVerified par admin
router.route('/verifiedUser/:id')
    .put(isAdmin, user.putVerifiedUser)

// Gestion des utilisateurs par admin
router.route('/adminUserEdit/:id')
    .get(isAdmin, user.getUserEdit)
    .put(isAdmin, user.putlistUser)
    .delete(isAdmin, user.deleteOneUserAdmin)

/*
 * Admin
 ***********/
// Affichage page admin
router.route('/admin')
    .get(isAdmin, admin.getAdmin)




module.exports = router
