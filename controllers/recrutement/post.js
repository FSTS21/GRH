const {
    check,
    validationResult
} = require('express-validator');
const specialFncs = require('../../config/specialFunctions');
const Personne = require('../../models/personne')
const config = require("./config")



module.exports = [
    /* *********************** middleware to initale my page **********/
    (req, res, next) => {
        req.body = { ...req.fields }
        next()
    },
    /* *********************** middlewares to check my fields **********/
    check("nom").trim().custom(specialFncs.checkSpecialChars),
    check("prenom").trim().custom(specialFncs.checkSpecialChars),
    check("nomAr").trim().custom(specialFncs.checkSpecialChars),
    check("prenomAr").trim().custom(specialFncs.checkSpecialChars),
    check("CIN").trim().custom(specialFncs.checkSpecialChars),
    check("email").isEmail().withMessage("Veuillez taper un email valide"),
    check("lieuNaissance").trim().custom(specialFncs.checkSpecialChars),
    check("lieuNaissanceAr").trim().custom(specialFncs.checkSpecialChars),
    check("adresse").trim().custom(specialFncs.checkSpecialChars),
    check("matriculeVehicule").trim().custom(specialFncs.checkSpecialChars),
    check("photo").trim().custom(specialFncs.checkSpecialChars),
    check("gsm").trim().custom(specialFncs.checkSpecialChars),
    check("numFix").trim().custom(specialFncs.checkSpecialChars),

    /* ********************** middleware to initialise all my form with req.body. fields */
    (req, res, next) => {
        console.log("initialise all my form")
        res.locals.personne = new Personne({
            ...req.fields
        })
        console.log("my form is initalised => %s", res.locals.personne)
        next()
    },

    /* ********************** middleware to check if there are any errors found on the form */
    (req, res, next) => {
        res.locals.myErrors = {}
        res.locals.result = null
        console.log("check if there are any errors")
        const errors = validationResult(req).array()
        errors.forEach(err => {
            res.locals.myErrors[err.param] = err.msg
        });

        if (errors.length) {
            res.locals.result = "Une erreur s'est produite lors d'ajout du personne"
            res.render(config.page, {
                ...config.initPage
            })
            console.log(res.locals.result)
            return
        } else
            next()

    },

    /* ***************** middlwares to escape all my fields ****************/
    check("nom").escape(),
    check("prenom").escape(),
    check("nomAr").escape(),
    check("prenomAr").escape(),
    check("CIN").escape(),
    check("email").escape(),
    check("lieuNaissance").escape(),
    check("lieuNaissanceAr").escape(),
    check("adresse").escape(),
    check("matriculeVehicule").escape(),
    check("photo").escape(),
    check("gsm").escape(),
    check("numFix").escape(),
    
    /* ***************** middlware to save the personne ****************/
    (req, res, next) => {
        const personneDao = require("../../Dao/personneDao")
        personneDao.saveTempOne(res.locals.personne)
            .then(newPersonne => {
                if (!Object.keys(newPersonne).length) {
                    res.locals.result = "On arrive pas à trouver la personne que vous venez d'ajouter"
                    res.render(config.page, {
                        ...config.initPage
                    })
                    return
                } else {
                    console.log("Personne added!")
                    res.locals.result = "Personne ajoutée avec succés"
                    res.locals.success = true
                    next()
                }
            })
            .catch(err => {
                res.locals.result = "Coordonnées non insérées à la base de donnée!"
                specialFncs.catchErrors(err.errors, res.locals.myErrors)
                console.log(res.locals.result)
                console.log(err)
                next()
            })

    },

    /* ************************ The LAST middleware *******************/
    function (req, res, next) {
        console.log("LAST middleware")
        res.render(config.page, {
            ...config.initPage
        })
        return
    }
]