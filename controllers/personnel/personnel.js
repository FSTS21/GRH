const Personnel = require("../../models/personnel")
const Cadre = require("../../models/cadre")

module.exports = [
    (req, res, next) => {
        Personnel.findById(req.params._id)
            .populate({
                path: "personne",
                model: require("../../models/personne")
            })
            .orFail(() => {
                console.log("Can't find it")
                throw new Error("Aucun personnel trouvé")
            })
            .then(result => {
                res.locals.personnel = result
                console.log("personnel : ", result.personne.nom)
                next()
            })
            .catch(err => {
                console.log('err => ', err)
                res.locals.result = err
                res.render("admin/personnel")
            })
    },
    (req, res, next) => {

        Cadre.find()
            .populate({
                path: 'grades',
                model: require("../../models/grade"),
                populate: {
                    path: 'echelons',
                    model: require("../../models/echelon"),
                    match: {
                        avancements: {
                            $not: {
                                $size: 0
                            }
                        }
                    }
                }
            })
            .then(results => {
                res.locals.cadres = results
                next()
            })


    }
]