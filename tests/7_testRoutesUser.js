// const mongoose = require('mongoose');
// const chai = require('chai');
// const should = chai.should();
// const expect = require('chai').expect;
// const chaiHttp = require('chai-http');

// const app = require('../server');
// const userCollection = require('../api/database/models/userModel');
// const actuCollection = require('../api/database/models/actuModel');

// chai.use(chaiHttp);

// describe('Route', async () => {

//     beforeEach(async () => {
//         // exécution à faire avant chaque test (ici avant chaque it)
//         // console.log("Suppression des collections (ici actu) avant le debut de chaque it");
//         await actuCollection.deleteMany({})
//     });

//     beforeEach(async () => {
//         // exécution à faire avant chaque test (ici avant chaque it)
//         // console.log("Suppression des collections (ici user) avant le debut de chaque it");
//         await userCollection.deleteMany({})
//     });

//     describe('Actu', async () => {

//         describe('/GET getActu', async () => {
//             it('OK malgré BDD vide', (done) => {
//                 chai.request(app)
//                     .get('/actus')
//                     .end(async (err, res) => {
//                         const actu = await actuCollection.find({})

//                         expect(actu).to.be.an('array');
//                         expect(actu).to.be.empty;
//                         res.should.have.status(200);
//                         // expect(res.status).to.be.equal(200);
//                         done();
//                     })
//             });

//             it('OK avec 2 actus', (done) => {

//                 // console.log('creation');
//                 const firstActu = new actuCollection({
//                     title: 'test1',
//                     content: 'test1'
//                 });

//                 const secondActu = new actuCollection({
//                     title: 'test2',
//                     content: 'test2'
//                 });

//                 firstActu.save(async () => {
//                     secondActu.save(async () => {
//                         chai.request(app)
//                             .get('/actus')
//                             .end(async (err, res) => {
//                                 const actu = await actuCollection.find({})

//                                 expect(actu).to.be.an('array');
//                                 expect(actu).to.have.lengthOf(2);
//                                 res.should.have.status(200);
//                                 // expect(res.status).to.be.equal(200);
//                                 expect(actu[0].title).to.be.equal(firstActu.title);
//                                 expect(actu[0].content).to.be.equal(firstActu.content);
//                                 expect(actu[1].title).to.be.equal(secondActu.title);
//                                 expect(actu[1].content).to.be.equal(secondActu.content);
//                                 done();
//                             })
//                     })
//                 })

//             });

//         });

//     });

//     describe('User', async () => {
//         describe('/POST userCreate', async () => {

//             it("Créer un utilisateur : réussi", (done) => {

//                 const param = { name: 'testy', pseudo: 'testy', email: 'testy@test.fr', password: 'test', confPassword: 'test', gridCheck: 'on' };

//                 chai.request(app)
//                     .post('/userCreate')
//                     .send(param)
//                     .end(async (err, res) => {
//                         const user = await userCollection.find({})

//                         expect(user).to.be.an('array');
//                         expect(user[0].name).to.be.equal(param.name);
//                         res.should.have.status(200);
//                         // expect(res.status).to.be.equal(200);
//                         done();
//                     })
//             });

//             it("Créer un utilisateur : case conditions site cochée : 'requis' ", (done) => {

//                 const param = { name: 'testy', pseudo: 'testyNameRequis', email: 'testy@test.fr', password: 'test',  confPassword: 'test' };

//                 chai.request(app)
//                     .post('/userCreate')
//                     .set('Accept', 'application/json')
//                     .send(param)
//                     .end(async (err, res) => {
//                         const user = await userCollection.find({})

//                         expect(user).to.be.an('array');
//                         expect(user).to.be.empty;
//                         res.should.have.status(200);
//                         expect(res.body.message).to.equal("Vous n'avez pas accepté les conditions générales d'utilisations du site. Veuillez cocher la case.");
//                         // expect(res.status).to.be.equal(200);
//                         done();
//                     })
//             });

//             it("Créer un utilisateur : mot de passe identique : 'requis' ", (done) => {

//                 const param = { name: 'testy', pseudo: 'testyNameRequis', email: 'testy@test.fr', password: 'test',  gridCheck: 'on' };

//                 chai.request(app)
//                     .post('/userCreate')
//                     .set('Accept', 'application/json')
//                     .send(param)
//                     .end(async (err, res) => {
//                         const user = await userCollection.find({})

//                         expect(user).to.be.an('array');
//                         expect(user).to.be.empty;
//                         res.should.have.status(200);
//                         expect(res.body.message).to.equal('Vos mots de passe sont différents. Veuillez rééssayer.');
//                         // expect(res.status).to.be.equal(200);
//                         done();
//                     })
//             });
//         });

//     });

// })
