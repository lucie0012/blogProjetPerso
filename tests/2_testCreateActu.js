// const assert = require('assert');
// const actuCollection = require('../api/database/models/actuModel');

// describe("CRUD 1 article : CREATE", () => {

//     beforeEach(async () => {
//     // exécution à faire avant chaque test (ici avant chaque it)
//         // console.log("Suppression des collections (ici actu) avant le debut de chaque it");
//         await actuCollection.deleteMany({})
//     });

//     it("CREATE : Créer un article", (done) => {
//         const actu = new actuCollection({
//             title: "test",
//             content: "test",
//         });

//         // console.log(actu.isNew);
//         // ici = true (car ne fait pas encore parti de la BD)

//         actu.save()
//             .then(() => {
//                 // console.log(actu.isNew);
//                 // ici = false (car maintenant qu'il est sauvegardé, il fait parti de la BD)

//                 assert.equal(actu.isNew, false);
//                 // isNew : spécifie si le document est nouveau
//                 done();
//             })
//     });
// });

