const specialFncs = require('../../config/specialFunctions');
const config = require("./config_2")


module.exports = [

    /* ***************** Trouver la personne ****************/
    (req, res, next) => {
        require("../../models/personne").findOne({CIN : req.params.personne})
            .orFail(() => {
                res.locals.result = "On n'arrive pas à trouver les infomration personnelles à la base donnée"
                res.render(config.page)
            })
            .then(result => {
                res.locals.personnel.personne = result
                next()
            }).catch(err => {
                res.locals.result = "Erreur s'est produite! "+ err
                specialFncs.catchErrors(err.errors, res.locals.myErrors)
                console.error(err.stack);
                res.render(config.page)
            })
    }]
