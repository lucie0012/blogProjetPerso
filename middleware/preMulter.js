module.exports = (req, res, next) => {
    const Pass = req.body.password
    const confPass = req.body.confPassword
    console.log("multer " + req.body);
    console.log("multer " + req.body.password);
    // !!!! reconnait pas le req.body..... donc ne fonctionne pas => à étudier

    if (Pass !== confPass) {
        console.log('mdp different donc pas de creation');
        res.redirect('/')
    } else {
        next()
    }
}
