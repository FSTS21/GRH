const {
    check,
    validationResult
} = require('express-validator');
const specialFncs = require('../../config/specialFunctions');
const Personne = require('../../models/personne')
const personneConf = require('../../models/config/personneConf')

const config = require("./config")

let ext

module.exports = [
    /* *********************** middleware to initale my page **********/
    (req, res, next) => {
        req.body = {
            ...req.fields
        }
        req.body.photo = req.files.photo.name
        console.log("prepare redirecting to ",req.originalUrl+"545456")
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
    check("gsm").trim().custom(specialFncs.checkSpecialChars),
    check("numFix").trim().custom(specialFncs.checkSpecialChars),
    check('photo', "Veuillez joindre une photo").notEmpty(),
    check('photo')
    .custom((value, {
        req
    }) => {

        if (req.files.photo.name === '')
            return true

        switch (req.files.photo.type) {
            case 'image/pjpeg':
            case 'image/jpeg':
                ext = 'jpg';
                break;
            case 'image/png':
                ext = 'png';
                break;
            default:
                ext = false
                break
        }

        return ext
    })
    .withMessage('Formats de fichiers pris en charge : JPG et PNG'), // custom error message that will be send back if the file in not a pdf. 
    check('photo')
    .custom((value, {
        req
    }) => {
        // console.log("photo : ", req.files.photo.size / (1024 * 1024))

        if (req.files.photo.size / (1024 * 1024) > 2)
            return false
        else
            return true
    })
    .withMessage('Taille de fichier dépasse 2 Mo'), // custom error message that will be send back if the file in not a pdf. 

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
    check("gsm").escape(),
    check("numFix").escape(),

    (req, res, next) => {
        var oldpath = req.files.photo.path;
        const fileName = res.locals.personne._id + "." + ext
        res.locals.personne.photo = fileName
        var newpath = personneConf.pathFolder + fileName;
        console.log("fileName : ",fileName)

        console.log("oldpath : ", oldpath)
        require('fs').rename(oldpath, newpath, function (err) {
            if (err) { //throw new Error(err)
                console.log("newpath : ",newpath)
                res.locals.result = "Une erreur s'est produite lors du transfert du fichier"
                res.render(config.page)
            }
            next()
        });

    },

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
                    console.log("Personne added! ",newPersonne._id)
                    // res.locals.result = "Personne ajoutée avec succés"
                    res.locals.success = true
                    next()
                }
            })
            .catch(err => {
                res.locals.result = "Coordonnées non insérées à la base de donnée!"
                specialFncs.catchErrors(err.errors, res.locals.myErrors)
                console.log(res.locals.result)
                console.log(err)
                res.render(config.page, {
                    ...config.initPage
                })
        })

    },

    /* ************************ The LAST middleware *******************/
    function (req, res, next) {
        console.log("LAST middleware")
        /* res.render(config.page, {
            ...config.initPage
        })
        return */
        console.log("redirect to ",res.locals.personne._id)
        res.redirect(req.originalUrl+"/"+res.locals.personne.CIN);

    }
]