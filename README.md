# blogProjetPerso
Blog projet perso arinfo

#// INDICATIONS :
// si pas fait : installer node js version 12 (cf word)
// si pas fait : télécharger npm version 6.13 (cf word)

// via le terminal : "npm init" pour démarrer le projet (car c'est un nouveau projet)
// si c'est un projet qu'on récupère ou déjà initilatisé alors faire "npm i" (pour npm install) il va automatiquement installer toutes les dépendances présente dans package.json

// installer "nodemon" via le terminal : "npm i nodemon"

// modifier dans package.json le scripts "start" pour remplacer "node server.js" par "nodemon server.js" 
// et y ajouter le scripts "reinstall" (penser à faire npm run reinstall pour le lancer)

// installer "express" via le terminal : "npm i express"
// "require" le module express et créer notre const "app"

// créer le "serveur" via app.listen en indiquant le port

// installer le moteur de templating : ici : "handlebars" : "npm install express-handlebars"
// "require" le module express-handlebars et faire son paramétrage,

// créer la structure de notre dossier afin de faire correspondre à notre code:
// ├── server.js
// └── public (dossier) (car il faut y regrouper tout les fichiers statique afin de paramétrer plus tard sa lecture par express)
//          ├── css (dossier)
//              └── style.css
//          └── ressources (dossier)
//              └── images (dossier)
// └── views (dossier)
//          ├── home.hbs
//          ├── partials (dossier)
//              └── main (dossier)
//          └── layouts (dossier)
//              └── main.hbs
// └── middleware (dossier)
// └── api (dossier)
//          ├── controllers (dossier)
//          └── database (dossier)
//              └── models (dossier)
//          └── main.hbs

// créer dans views la page home.hbs avec un h1 : coucou et dans le dossier views puis partials puis main créer le head.hbs et end.hbs
// créer dans layouts la page main.hbs dans lequel j'appel via {{> main/head}} {{{ body }}} {{> main/end }} le corps HTML des pages hbs
// dans controllers créer la page home.js qui res.render la page home.hbs 
// et créer dans api le "router.js" (avec require express et création express.router), y appeler la controllers home.js et y faire un get.home rapide afin de vérifier que tout fonctionne

// créer la page error404.hbs et créer sa route dans server.js

// si pas fait : installer mongoDb (la BDD): https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/ et doc word 
// si pas fait : installer robo3t (interface graphique pour utiliser mongoDb) : https://www.techrunnr.com/install-robomongo-robo-3t-on-ubuntu-18-04/ et doc word

// installer mongoose (pour permettre à nodeJs de communiquer avec mongoDb) : sur le terminal de commande de VSC : « npm i --save mongoose » 
// "require" le module mongoose et le paramétrer

// démarrer mongo sur un terminal à part : "mongod" (ou "sudo mongod") et ouvrir "robo3t" (ou pour utiliser mongodb en ligne de commande : sur un autre terminal : « sudo mongo »))

// installer "body-parser" : "npm i body-parser"
// "require" le module "body-parser" et le paramétrer

// installer method-override : "npm i method-override"
// require le module "method-override" et le paramétrer

// si erreur de "parents" : installer handlebars version 4.5 (dans tout les cas nécessaire pour moment.handlebars) : "npm i -D handlebars@4.5.0"

// créer le model de BDD (afin que notre CRUD se cale selon ce model)

// créer notre CRUD :
 - get page create
 - post page create (en verifiant que recup bien donnée via console log et verif BDD)
 - get page actu avec toutes les données de toutes les actus (#each)
 - get page actu avec les données d'une actu
 - delete une actu
 - modifier une actu

// installer handlebars.moment (pour gérer la mise en forme de la date) : "npm i handlebars.moment"
// require le module handlebars.moment et handlebars (installer précedemment si erreur de "parents" sinon l'installer) et paramétrer
// bien penser à paramétrer le model :
    createDate : {
        type: Date,
        default : new Date(),
    },

// installer "multer" (pour gérer upload photo) : "npm i multer"
// require le module (ici dans router.js) et paramétrer (ici dans router.js), paramétrer son chemin statique (dans server.js)
// penser également à indiquer : enctype="multipart/form-data" dans le "form"
// gérer ensuite le format et le type d'image : dans le paramétrage multer dans "router.js" mais aussi dans notre post de actus.js (gestion erreur)
// mieux de gérer la taille de l'image dans actus.js
// pour supprimer l'image, besoin de require les modules "path" et "fs" (inclus dans nodejs) donc pas à installer
// ATTENTION : 


// GITHUB : 
// penser à créer le fichier .gitignore comprenant : node_modules/*
// créer un nouveau repository (penser à créer un readme)
// récupérer le lien SSH dans "clone or download" et faire un "git clone copiercoller" via le terminal (penser à être sur le dossier github dans le bureau)
// créer une branch premaster : "git branch premaster"
// coller le projet déjà démarré dans le dossier github
// faire un "git status", "git add .", "git commit -m 'nomcommit'" et "git push origin master" (car au départ on est sur la master)
// se mettre sur la branch premaster "git checkout premaster" et récupérer le projet sur la master "git pull origin master", "git commit -m 'nomcommit' et "git push origin premaster"

// mongoDB Cloud : 
// sur mongodb cloud (atlas) faire un "new project" puis "build a cluster" / free / franckfurt (le plus proche) / name 
// sur le cluster concerné : connect
// "add your current IP adress" : 0.0.0.0 (pour y accéder de toutes les adresse IP) puis "add IP adress"
// créer "username" et "password" (cf word github) puis "choose a connection method"
// "connect your application"
// copier le "connexion string only" et le copier dans notre const urlDb en complément de celle local (et mettre la local en commentaire) / remplacer le <password> par celui créé à l'étape précédente
// créer le dossier "config" dans le dossier api puis le fichier "config.js" et y mettre en  module.exports les infos urldb et port
// dans server.js : require le fichier et l'appeler dans nos constantes pour les utiliser
// indiquer ce fichier dans le gitignore


// créer le modèle utilisateur
// créer la page "création de compte" / "liste utilisateur" / "edition de compte" / "supp compte" avec gestion image

// gérer la connexion simple via le controllers

// gérer le chiffrage des mdp via bcrypt
// installer bcrypt : "npm i bcrypt"
// le require dans le modèle utilisateur la où on "pré" hash le mdp (le faire ici comme ça à chaque fois qu'on utilise/appel notre modele utilisateur il effectue le pre hash directement), la création de cloud avec chiffrage se fait donc automatiquement (rien à faire dans le post du controllers)
// gérer l'authentification avec le chiffrage (penser à require "bcrypt" dans le controllers)

// gérer l'authentification avec les sessions :
// installer express-session (créer les cookies de session) et connect-mongo (connecter les cookies à la BDD) via "npm i express-session" et "npm i connect-mongo"
// require les modules
// connecter connect mongo à express session (dans server.js)
// paramétrer express session
// dans le controller et dans le post de connexion, affecter les données de la bdd utilisateur à la session (ex : req.session.name = dbUser.name)
// créer le "app.use('*') (* pour toutes les pages) pour affecter chaque données req.session au res.local de la même donnée (ex: res.locals.name = req.session.name)

// faire les middleware pour protéger les pages

// ajouter un layout "admin" : faire un nouveau fichier adminMain.hbs (bien le faire dans le dossier views puis layouts) puis paramétrer son chemin das server.js puis l'appeler où l'on souhaite dans les controllers

// selon le framework : penser à mettre le lien CSS dans le "head" et le lien JS avant la balise </body> ou à insérer le sass du framework dans le projet (cf doc insertion boostrap) :
// ICI : j'ai installé directement bootstrap : "npm i bootstrap"
// puis dans node module, copier le dossier bootstrap et coller dans dossier public/css
// dans package.json, ajouter ligne dans scripts{}:
"sass": "sass --watch ./public/css/bootstrap/scss/bootstrap.scss:./public/css/style.css"
// dans le head de la page main.hbs, mettre la ligne ci dessous (lien CSS) : 
"<link rel="stylesheet" href="/public/css/style.css">" (fait référence au chemin « public » créé dans server.js)
// dans le fichier end, avant la balise </body> mettre les liens JS de bootstrap (getting started site bootstrap)
// créer le fichier style.css dans le dossier public/css (il est vide c’est normal)
// supprimer la ligne « bootstrap » dans package.json pour qu’au prochain "npm run reinstall", le module ne se réinstalle pas (car plus besoin vu qu’on a copié le dossier)
// démarrer le projet : « nodemon » sur un terminal (comme d’hab)
// puis démarrer sass « npm run sass » (sur un terminal à part). 
// Aller modifier dans un fichier bootstrap (ex : _alert.scss) (ajouter un retour à la ligne par ex) : seulement à faire la première fois pour que bootstrap voit une différence et écrive dans le style.css
// ATTENTION : ne jamais écrire dans le style.css (ou bootstrap.scss) : c’est bootstrap qui le fait : il faut modifier directement dans les dossier concerné dans scss
// Créer un fichier "_mystyle.scss" dans le dossier style/css/bootstrap/scss, puis dans bootstrap.scss faire @import « mystyle » (dedans on pourra créer notre propre scss : attention cela peut rentrer en conflit avec les classes bootstrap)
// Dès qu’on est en phase dev : on lance « nodemon » sur notre terminal et « npm run sass » (sur un terminal à part) mais en phase prod (pas besoin) 

// créer les pages header (contenant nav) et footer et les intégrer dans le main.hbs (via les {{> }})
// utilisation balise "header" pour la partie liens et logo/titre et "nav" pour la navbar (cf structure html5)
// créer la page scrollup et intégrer dans le main.hbs (utilisation balise "aside" : car lié à la page mais ne fait pas partie du contenu principal)

// créer le header avec les nav (pour l'ajout de l'image dans le header, bien penser à indiquer son chemin via /public/...)

// créer les pages nécessaire au site et leur chemin

// créer les modals lié à la page d'accueil

// cf word dossier projet


// MEP nodemailer : (https://www.supinfo.com/articles/single/2102-envoyer-mails-avec-nodejs-nodemailer)
// installer nodemailer ?
// créer une boite mail pour cette gestion et bien penser à activer le paramètre "Autoriser les applications moins sécurisées" 
// require le module (dans le controller)
// 

