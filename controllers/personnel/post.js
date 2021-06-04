const {
    check,
    validationResult
} = require('express-validator');

const ObjectId = require("mongoose").Types.ObjectId

let ext
const specialFncs = require('../../config/specialFunctions');
const Avancement = require('../../models/avancement');
const avancementConf = require('../../models//config/avancementConf');
const Echelon = require('../../models/echelon')
const async = require("async")
var fs = require('fs');
const  personnel = require('../../models/personnel');
const page = "admin/personnel"
module.exports = [
    require("./form"),
    require("./personnel"),
    require('./avancements'),
    (req, res, next) => {
        req.body.arrete = req.files.arrete.name
        next()
    },

    /* ********************** middleware to initialise all my form with req.body. fields */
    (req, res, next) => {
        res.locals.myErrors = {}
        console.log("initialise all my form")

        res.locals.echelon = new Echelon({
            _id: req.fields.echelon
        })

        res.locals.avancement = new Avancement({
            dateEffet: req.fields.dateEffet,
            type: req.fields.type,
        })

        res.locals.cadre = req.fields.cadre
        res.locals.grade = req.fields.grade
        next()

    },
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
                console.log("ext : ", ext)
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
                res.render(page)
            })
            .then(() => {
                console.log("echelond founded ", res.locals.echelon._id)
                next()
            })
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
            res.locals.result = "Une erreur s'est produite, veuillez vérifier le formulaire"
            res.render(page)
            console.log(res.locals.result)
            return
        } else
            next()

    },
    (req, res, next) => {
        var oldpath = req.files.arrete.path;
        const fileName = res.locals.avancement._id + "." + ext
        res.locals.avancement.arrete = fileName
        var newpath = avancementConf.pathFolder + fileName;
        console.log("avancementConf.path : ",avancementConf.pathFolder)
        console.log("fileName : ",fileName)

        console.log("oldpath : ", oldpath)
        fs.rename(oldpath, newpath, function (err) {
            if (err) { //throw new Error(err)
                console.log("newpath : ",newpath)
                res.locals.result = "Une erreur s'est produite lors du transfert du fichier"
                res.render(page)
            }
            next()
        });

    },
    (req, res, next) => {
        res.locals.avancement.save()
            .catch(err => {
                res.locals.result = "Avancement non inséré à la base de donnée!"
                specialFncs.catchErrors(err.errors, res.locals.myErrors)
                next()

            })
            .then(() => {
                next()
            })
    },
    (req, res, next) => {
        async.parallel({
            addToPersonnel: (callback) => {
                personnel.updateOne({
                    _id: ObjectId(req.params._id)
                }, {
                    $push: { avancements : res.locals.avancement }
                }).catch(err => {
                    console.log("err : ",err)
                    callback(new Error("Une erreur s'est produite lorsqu'on a essayé d'attribuer l'avancement au personnel en question "))
                }).then(
                    callback(null,true)
                )
            },
            addToEchelon : (callback) => {
                Echelon.updateOne({
                    _id: ObjectId(req.fields.echelon)
                }, {
                    $push: { avancements : res.locals.avancement }
                }).catch(err => {
                    console.log("err : ",err)
                    callback(new Error("Une erreur s'est produite lorsqu'on a essayé d'attribuer l'avancement à l'échelon choisis "))
                }).then(
                    callback(null,true)
                )
            }
        }, (err, results) => {
            if(err){
                res.locals.result = err
                res.render(page)
            }
            else if( results.addToPersonnel && results.addToEchelon  ){
                res.locals.result = "Avancement ajouté avec succés"
                res.locals.success = true
                next()
            }
        })
    },
    require("./avancements"),
    (req, res, next) => {
        res.render(page)
    }
]