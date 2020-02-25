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


const app = express()
const port = process.env.PORT || 5000
const urlDB = "mongodb://localhost:27017/projetperso"


/* Gestion fichiers statiques
 ******************************/
app.use(express.static('public'));
app.use('/assets', express.static('public'));


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
