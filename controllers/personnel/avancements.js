const Personnel = require("../../models/personnel")
const Cadre = require("../../models/cadre")

module.exports = [
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
        /* if(req.method == "POST" && res.locals.callthis == false) {
            console.log(" NEXT..............")
            next()
        } */

        let match
        if (req.method == "POST") {
            match = {
                type: {
                    $ne: ""
                }
            }
        } else match = {}

        console.log("second avancemennts")
        Personnel.findById(req.params._id)
            .populate({
                path: "avancements",
                model: require("../../models/avancement"),
                options: {
                    sort: {
                        dateEffet: -1
                    }
                },
                match: match
            })
            .orFail(() => {
                console.log("Can't find it")
                throw new Error("Aucun personnel trouvé")
            })
            .then((result) => {
                res.locals.personnel.avancements = result.avancements
                console.log("done : ", result.avancements.length)
                next()
            })
            .catch(err => {
                console.log('err => ', err)
                res.locals.result = err
                res.render("admin/personnel")
            })
    },

    (req, res, next) => {
        res.locals.cadres.forEach(c => {
            res.locals.callthis = true
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

        next()
    }
]