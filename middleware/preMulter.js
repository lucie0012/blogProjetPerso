module.exports = (req, res, next) => {
    const Pass = req.body.password
    const confPass = req.body.confPassword
    console.log(req.body);
    // !!!! reconnait pas le req.body..... donc ne fonctionne pas => à étudier

    if (Pass !== confPass) {
        console.log('mdp different donc pas de creation');
        res.redirect('/userCreate')
    } else {
        next()
    }
}
