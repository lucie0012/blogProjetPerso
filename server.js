/*
 * Import Modules
 ******************************/
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const MomentHandler = require('handlebars.moment');
const Handlebars = require('handlebars');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo');
const helpers = require('handlebars-helpers')();
// pour utiliser tout les helpers de la librairie (sinon possible de sélectionner l'helpers souhaité)
const helmet = require('helmet');
// protéger les entêtes HTTP
const morgan = require('morgan');
// logger les requêtes

// const expressOasGenerator = require('express-oas-generator');
// (génère le fichier pour documenter API - mettre en commentaire une fois qu'il est généré)
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./api/config/swagger.json');
// (rend visible la doc API à l'adresse /api-docs : à commenter en mode prod)
// documenter l'API


const app = express();
const mongoStore = MongoStore(expressSession);

/*
 * Gestion urlDB et port (au départ du projet : le port et l'urlDb peuvent être ici)
 ******************************/
const config = require('./api/config/config');
// PORT SITE EN PROD
const port = config.dev.portProd;
// PORT test serveur
// const port =config.dev.portDev;
const urlDB = config.prod.urlDBcloud;
// const urlDB = config.prod.urlDBcloudTest;
// const urlDB = config.prod.urlDBlocal;


/* morgan (log requêtes) - format "dev"
 **************************************/
// app.use(morgan('dev'));


/* openAPI/swagger (génère le fichier pour documenter API - mettre en commentaire une fois qu'il est généré)
 ***********************************/
// expressOasGenerator.init(app, {});


/* Cookie Parser (pour utiliser req.cookies)
 **************************************/
app.use(cookieParser());


/* Helmet (protection des entêtes HTTP)
 **************************************/
app.use(helmet());


/* Gestion fichiers statiques
 ******************************/
// app.use(express.static('public'));
app.use('/public', express.static('public'));


/*
 * Method-Override (pour pouvoir indiquer un delete via une pethode POST dans le code HTML)
 ******************************/
app.use(methodOverride(config.methodOverride.value));


/*
 * Body Parser (PENSER à le mettre avant "app.use("/", router)" sinon il ne prend pas le "req.body")
 ******************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*
 * Helpers
 ******************************/

// **************limitEach***********
Handlebars.registerHelper('limitEach', function (arr, limitEach) {
    if (!Array.isArray(arr)) { return []; }
    return arr.slice(-limitEach).reverse();
});

// **************limitation taille texte cards**********
Handlebars.registerHelper('truncate', function (str, len) {
    if (str != null && str.length > len && str.length > 0) {
        return new Handlebars.SafeString(str.substring(0, len) + '...');
    }
    return str;

});

// **************reverse***********
Handlebars.registerHelper('reverse', function (arr) {
    if (!Array.isArray(arr)) { return []; }
    return arr.reverse();
});


/*
 * Express session
 ******************************/
app.use(expressSession({
    secret: config.expressSession.secret,
    name: config.expressSession.name,
    saveUninitialized: true,
    resave: false,
    store: new mongoStore(
        { mongooseConnection: mongoose.connection }
    ),
    cookie: {
        maxAge: 900000,
        // correspond à 15mn inactif
        httpOnly: true,
        sameSite: true,
        // secure: true
    }
}));

app.use('*', async (req, res, next) => {
    if (req.session) {
        res.locals.id = req.session.userId
        res.locals.user = req.session.status
        // // le req.session.status et donc le dbUser.status est toujours "user" dès lors qu'il a un compte
        // // donc res.locals.user signifie que la personne a un compte et est connecté (et donc #if user verifie cette condition là)
        res.locals.isAdmin = req.session.isAdmin
        res.locals.isModo = req.session.isModo
        res.locals.isVerified = req.session.isVerified
        res.locals.isBan = req.session.isBan
    }
    //console.log(req.session);

    next()
})

/*
 * Moment
 ******************************/
MomentHandler.registerHelpers(Handlebars);


/*
 * Mongoose
 ******************************/
mongoose.connect(urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => console.log('Connecté à MongoDB Cloud'))
    .catch(() => console.log('Connexion à MongoDB Cloud échouée'))


/*
 * Handlebars
 ******************************/
var handlebars = require('handlebars')
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/'
    // ajout du 2ème layout
}));
app.set('view engine', 'hbs');


/* openAPI/swagger (rend visible la doc API à l'adresse /api-docs : à commenter en mode prod)
 ***********************************/
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


/*
 * Router (PENSER à mettre à la fin dans l'architecture)
 ********************************************************/
const router = require('./api/router');

app.use('/', router);


/*
 * Error 404 (à la fin également car c'est si ne trouve pas les routes alors passe ici)
 ******************************/
app.use((req, res) => {
    res.render('error')
});


/*
 * Port
 ******************************/
app.listen(port, function () {
    console.log("Le serveur tourne sur le port : " + port);
});

module.exports = app
