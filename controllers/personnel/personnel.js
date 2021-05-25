const Personnel = require("../../models/personnel")
const Cadre = require("../../models/cadre")

module.exports = [(req, res, next) => {
        res.locals.page_title = "Informations personnels"
        Personnel.findById(req.params._id)
            .populate({
                path: "personne",
                model: require("../../models/personne")
            })
            .populate({
                path: "avancements",
                model: require("../../models/avancement"),
                options: {
                    sort: {
                        dateEffet: -1
                    }
                }
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


    },
    (req, res, next) => {
        res.locals.cadres.forEach(c => {
            c.grades.forEach(g => {
                g.echelons.forEach(e => {
                    e.avancements.forEach(a => {
                        res.locals.personnel.avancements.forEach(p_av => {
                            if (p_av._id.equals(a)) {
                                p_av.cadre = c
                                p_av.grade = g
                                p_av.echelon = e
                            }
                        })
                    })
                })
            })
        })

        res.render("admin/personnel")
    }
]