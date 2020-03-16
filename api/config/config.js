module.exports = {
    prod: {
        urlDBlocal: "mongodb://localhost:27017/projetperso",
        urlDBcloud: "mongodb+srv://lucie:eodeezae250812@blogprojetperso-ycggc.mongodb.net/test?retryWrites=true&w=majority"
    },

    dev: {
        port: process.env.PORT || 5000
    }
}