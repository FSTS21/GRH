const {
    check,
    validationResult
} = require('express-validator');
const specialFncs = require('../../config/specialFunctions');
const Personnel = require('../../models/personnel')
// const personnelConf = require('../../models/config/personnelConf')
const Echelon = require('../../models/echelon')
const ObjectId = require("mongoose").Types.ObjectId


const Avancement = require('../../models/avancement');
const avancementConf = require('../../models//config/avancementConf');


const config = require("./config_2")

let ext

module.exports = [
    require("../includes/loadEchelons"),
    /* *********************** middleware to initale my page **********/
    (req, res, next) => {

        Object.assign(res.locals, config.initPage)
        req.body = {
            ...req.fields
        }
        req.body.arrete = req.files.arrete.name

        res.locals.echelon = new Echelon({
            _id: req.fields.echelon
        })

        res.locals.avancement = new Avancement({
            dateEffet: req.fields.dateEffet,
            type: "recrutement",
        })

        res.locals.cadre = req.fields.cadre
        res.locals.grade = req.fields.grade

        console.log("cadre : ", req.fields.cadre)
        console.log("grade : ", req.fields.grade)
        next()

    },
    /* *********************** middlewares to check my fields **********/
    check("SOM").trim().custom(specialFncs.checkSpecialChars),
    check("fonction").trim().custom(specialFncs.checkSpecialChars),
    check("fonctionAr").trim().custom(specialFncs.checkSpecialChars),
    check("emailAcademique").isEmail().withMessage("Veuillez taper un email valide"),
    check('arrete', "Veuillez joindre un arrété").notEmpty(),
    check('arrete')
    .custom((value, {
        req
    }) => {

        if (req.files.arrete.name === '')
            return true

        switch (req.files.arrete.type) {
            case 'application/pdf':
                ext = 'pdf';
                break;
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
    .withMessage('Formats de fichiers pris en charge : PDF, JPG et PNG'), // custom error message that will be send back if the file in not a pdf. 
    check('arrete')
    .custom((value, {
        req
    }) => {
        if (req.files.arrete.size / (1024 * 1024) > 4)
            return false
        else
            return true
    })
    .withMessage('Taille de fichier dépasse 2 Mo'), // custom error message that will be send back if the file in not a pdf. 

    /* ********************** middleware to initialise all my form with req.body. fields */
    (req, res, next) => {
        console.log("initialise all my form")
        res.locals.personnel = new Personnel({
            ...req.fields
        })
        console.log("my form is initalised => %s", res.locals.personnel)
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
            res.locals.result = "Une erreur s'est produite lors d'ajout du personnel"
            res.render(config.page)
            console.log(res.locals.result)
            return
        } else
            next()

    },

    /* *************** Trouver l'echelon ************** */
    (req, res, next) => {
        Echelon.findOne({
                _id: res.locals.echelon._id
            })
            .orFail(() => {
                throw new Error("Echelon non trouvé à la base de donnée")
            })
            .catch(() => {
                res.locals.result = "Veuillez bien remplissez le formulaire"
                res.locals.myErrors.echelon = "Veuillez choisir un echelon"
                console.log("myErrors => ", res.locals.myErrors)
                res.render(config.page)
            })
            .then(() => {
                console.log("echelond founded ", res.locals.echelon._id)
                next()
            })
    },

    /* ***************** middlwares to escape all my fields ****************/
    check("SOM").escape(),
    check("fonction").escape(),
    check("fonctionAr").escape(),
    check("emailAcademique").escape(),

    (req, res, next) => {
        var oldpath = req.files.arrete.path;
        const fileName = res.locals.avancement._id + "." + ext
        res.locals.avancement.arrete = fileName
        var newpath = avancementConf.pathFolder + fileName;
        console.log("fileName : ", fileName)

        console.log("oldpath : ", oldpath)
        require('fs').rename(oldpath, newpath, function (err) {
            if (err) { //throw new Error(err)
                console.log("newpath : ", newpath)
                res.locals.result = "Une erreur s'est produite lors du transfert du fichier"
                res.render(config.page)
            }
            next()
        });

    },


    /* ***************** Trouver la personne ****************/
    (req, res, next) => {
        require("../../models/personne").findById(req.params.personne)
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
                res.render(config.page)
            })
    },

    /* ******************** ajouter l'avancement ******************* */
    (req, res, next) => {
        res.locals.avancement.save()
            .catch(err => {
                res.locals.result = "Avancement non inséré à la base de donnée!"
                specialFncs.catchErrors(err.errors, res.locals.myErrors)
                next()

            })
            .then((result) => {
                res.locals.personnel.avancements = [result]
                next()
            })
    },

    /* ***************** middlware to save the personnel ****************/
    (req, res, next) => {
        const async = require("async")
        async.parallel({
            savePersonnel: callback => {
                res.locals.personnel.save()
                    .then(newPersonne => {
                        if (!Object.keys(newPersonne).length) {
                            callback( new Error("On arrive pas à trouver le personnel que vous venez d'ajouter"))
                            res.render(config.page)
                            return
                        } else {
                            callback(null, true)
                        }
                    })
                    .catch(err => {
                        specialFncs.catchErrors(err.errors, res.locals.myErrors)
                        callback( new Error("Coordonnées non insérées à la base de donnée! "+err))
                    })
            },
            addToEchelon: (callback) => {
                Echelon.updateOne({
                    _id: ObjectId(req.fields.echelon)
                }, {
                    $push: {
                        avancements: res.locals.avancement
                    }
                }).catch(err => {
                    console.log("err : ", err)
                    callback(new Error("Une erreur s'est produite lorsqu'on a essayé d'attribuer l'avancement à l'échelon choisis "))
                }).then(
                    callback(null, true)
                )
            }
        }, (err, results) => {
            if (err) {
                res.locals.result = err
                res.render(config.page)
            } else if (results.savePersonnel && results.addToEchelon) {
                res.locals.result = "Personnel recruté avec succés"
                res.locals.success = true
                next()
}
        })

    },

    /* ************************ The LAST middleware *******************/
    function (req, res, next) {
        console.log("LAST middleware")
        res.render(config.page)
        return
    }
]