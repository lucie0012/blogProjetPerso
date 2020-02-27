module.exports = (req, res, next) => {
    const Pass = req.body.password
    const confPass = req.body.confPassword
    // console.log(Pass + ' ' + confPass);

    if (Pass !== confPass) {
        console.log('mdp different donc pas de creation');
        res.redirect('/userCreate')
    } else {
        next()
    }
}
