/*
 * Import Modules
 ******************************/
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const MomentHandler = require("handlebars.moment");
const Handlebars = require("handlebars");
const expressSession = require('express-session');
const MongoStore = require('connect-mongo');


const app = express();
const mongoStore = MongoStore(expressSession);

/*
 * Gestion urlDB et port
 ******************************/
const config = require('./api/config/config');
// const port = process.env.PORT || 5000
const port = config.dev.port;
// const urlDB = "mongodb://localhost:27017/projetperso"
// const urlDB = "mongodb+srv://lucie:eodeezae250812@blogprojetperso-ycggc.mongodb.net/test?retryWrites=true&w=majority"
const urlDB = config.prod.urlDBcloud;


/* Gestion fichiers statiques
 ******************************/
// app.use(express.static('public'));
app.use('/public', express.static('public'));


/*
 * Method-Override (pour pouvoir indiquer un delete via une pethode POST dans le code HTML)
 ******************************/
app.use(methodOverride('_method'));


/*
 * Body Parser (PENSER à le mettre avant "app.use("/", router)" sinon il ne prend pas le "req.body")
 ******************************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


/*
 * Express session
 ******************************/
app.use(expressSession({
    secret: 'securite',
    name: 'cookie',
    saveUninitialized: true,
    resave: false,
    store: new mongoStore(
        { mongooseConnection: mongoose.connection }
    ),
    // expires: new Date(Date.now() + (3600000))
}));

app.use('*', (req, res, next) => {
    res.locals.id = req.session.userId
    res.locals.user = req.session.status
    // // le req.session.status et donc le dbUser.status est toujours "user" dès lors qu'il a un compte
    // // donc res.locals.user signifie que la personne a un compte et est connecté
    res.locals.name = req.session.name
    res.locals.fonction = req.session.fonction
    res.locals.isAdmin = req.session.isAdmin
    res.locals.isModo = req.session.isModo
    res.locals.isVerified = req.session.isVerified
    res.locals.isBan = req.session.isBan
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
});


/*
 * Handlebars
 ******************************/
var handlebars = require('handlebars')
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');


/*
 * Router (PENSER à mettre à la fin dans l'architecture)
 ******************************/
const router = require('./api/router')
app.use("/", router)


/*
 * Error 404
 ******************************/
app.use((req, res) => {
    res.render('error404')
})


/*
 * Port
 ******************************/
app.listen(port, function () {
    console.log("Le serveur tourne sur le port : " + port);
})
