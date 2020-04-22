// // https://blog.bitsrc.io/build-a-unit-testing-suite-with-mocha-and-mongoose-eba06c3b3625

// // BIEN PENSER A DEMARRER mongodb dans un autre terminal "sudo mongod" pour réaliser les tests
// // utiliser l'interface robot3T pour regarder les changements
// // démarrer les tests avec "npm test" (script dans package.json)

// const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;
// // dire à mongoose d'utiliser l'implémentation es6 des promesses

// mongoose.connect('mongodb://localhost:27017/testsMocha', {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// });

// const connection = mongoose.connection;
// connection.once('open', () => console.log('Connected!'))
//     // évenement unique
// connection.on('error', (error) => {
//         console.warn('Error : ',error);
//     });
//     // fonction à exécuter (ici : en cas d'erreur) une fois que l'évenement se produit 

// beforeEach((done) => {
// // exécution à faire avant chaque test (ici avant chaque describe)
//     mongoose.connection.db.dropDatabase(() => {
//     //permet de vider notre BDD avant d'éxécuter nos tests

//         // console.log("DB drop");
//         done();
//     });
// });